import logging
import re
from datetime import datetime, timezone
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, Header, HTTPException, Request, Response, status
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from stripe.error import SignatureVerificationError
import stripe

from app.core.config import settings
from app.db.database import (
    attach_stripe_session,
    create_order_record,
    get_db,
    mark_order_expired,
    mark_order_paid_from_checkout,
    mark_order_payment_failed,
)
from app.models.collection import Collection
from app.models.discount_code import DiscountCode
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.stock_notification import StockNotification
from app.schemas.collection import (
    CollectionCreate,
    CollectionListResponse,
    CollectionResponse,
    CollectionUpdate,
)
from app.schemas.checkout import CheckoutItem, CheckoutRequest, CheckoutResponse
from app.schemas.discount import (
    DiscountCodeCreate,
    DiscountCodeListResponse,
    DiscountCodeResponse,
    DiscountCodeUpdate,
    normalize_discount_code,
)
from app.schemas.product import (
    ProductCreate,
    ProductImportRequest,
    ProductImportResponse,
    ProductListResponse,
    ProductResponse,
    StockNotificationCreate,
    StockNotificationListResponse,
    StockNotificationResponse,
    ProductUpdate,
)
from app.services.stripe_service import (
    StripeCheckoutConfigurationError,
    StripeCheckoutRequestError,
    create_checkout_session,
)
from app.services.storage_service import (
    StorageConfigurationError,
    StorageUploadError,
    upload_product_image,
)

router = APIRouter()
logger = logging.getLogger(__name__)


def checkout_base_path(locale: str | None) -> str:
    return "/en" if locale == "en" else ""


def _clean_origin(value: str | None) -> str | None:
    if not value:
        return None
    parsed = urlparse(value.strip())
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return None
    return f"{parsed.scheme}://{parsed.netloc}"


def _origin_from_request(request: Request) -> str | None:
    host = request.headers.get("x-forwarded-host") or request.headers.get("host")
    if not host:
        return None
    proto = request.headers.get("x-forwarded-proto") or request.url.scheme or "https"
    proto = proto.split(",")[0].strip()
    return _clean_origin(f"{proto}://{host.split(',')[0].strip()}")


def _is_trusted_checkout_origin(value: str) -> bool:
    hostname = urlparse(value).hostname or ""
    return (
        hostname in {"accordijewelry.com", "www.accordijewelry.com", "localhost", "127.0.0.1"}
        or (hostname.endswith(".vercel.app") and hostname.startswith("accord-"))
    )


def checkout_origin(request: Request, requested_origin: str | None) -> str:
    request_origin = _origin_from_request(request)
    browser_origin = _clean_origin(requested_origin) or _clean_origin(request.headers.get("origin"))
    configured_origin = _clean_origin(settings.frontend_url)

    if browser_origin and _is_trusted_checkout_origin(browser_origin):
        return browser_origin
    if request_origin and _is_trusted_checkout_origin(request_origin):
        return request_origin

    return configured_origin or request_origin or "http://localhost:3000"


def require_admin(authorization: str | None = Header(default=None)) -> None:
    expected = f"Bearer {settings.admin_api_token}"
    if authorization != expected:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin authorization required")


def get_product_or_404(db: Session, product_id: int) -> Product:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


def get_collection_or_404(db: Session, collection_id: int) -> Collection:
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection


def ensure_valid_collection(db: Session, collection_id: int | None) -> None:
    if collection_id is None:
        return
    get_collection_or_404(db, collection_id)


def get_discount_or_404(db: Session, discount_id: int) -> DiscountCode:
    discount = db.query(DiscountCode).filter(DiscountCode.id == discount_id).first()
    if not discount:
        raise HTTPException(status_code=404, detail="Discount code not found")
    return discount


def ensure_unique_discount_code(db: Session, code: str, current_discount_id: int | None = None) -> None:
    query = db.query(DiscountCode).filter(DiscountCode.code == normalize_discount_code(code))
    if current_discount_id is not None:
        query = query.filter(DiscountCode.id != current_discount_id)
    if query.first():
        raise HTTPException(status_code=409, detail="Discount code already exists")


def active_discount_for_code(db: Session, code: str | None) -> DiscountCode | None:
    normalized_code = normalize_discount_code(code or "")
    if not normalized_code:
        return None

    discount = db.query(DiscountCode).filter(DiscountCode.code == normalized_code).first()
    if not discount or not discount.active:
        raise HTTPException(status_code=422, detail="Discount code is not valid")

    now = datetime.now(timezone.utc)
    starts_at = (
        discount.starts_at.replace(tzinfo=timezone.utc)
        if discount.starts_at and not discount.starts_at.tzinfo
        else discount.starts_at
    )
    expires_at = (
        discount.expires_at.replace(tzinfo=timezone.utc)
        if discount.expires_at and not discount.expires_at.tzinfo
        else discount.expires_at
    )
    if starts_at and starts_at > now:
        raise HTTPException(status_code=422, detail="Discount code is not active yet")
    if expires_at and expires_at < now:
        raise HTTPException(status_code=422, detail="Discount code has expired")
    if discount.max_redemptions is not None and discount.redeemed_count >= discount.max_redemptions:
        raise HTTPException(status_code=422, detail="Discount code has reached its usage limit")

    return discount


def ensure_unique_slug(db: Session, slug: str, current_product_id: int | None = None) -> None:
    existing = db.query(Product).filter(Product.slug == slug).first()
    if existing and existing.id != current_product_id:
        raise HTTPException(status_code=409, detail=f"Slug '{slug}' already exists")


def ensure_unique_collection_slug(db: Session, slug: str, current_collection_id: int | None = None) -> None:
    existing = db.query(Collection).filter(Collection.slug == slug).first()
    if existing and existing.id != current_collection_id:
        raise HTTPException(status_code=409, detail=f"Collection slug '{slug}' already exists")


def _parse_bool(value: str | None) -> bool:
    if value is None:
        return False
    return value.strip().lower() in {"1", "true", "on", "yes"}


def _parse_optional_int(value: str | None) -> int | None:
    if value is None:
        return None
    stripped = value.strip()
    if not stripped:
        return None
    return int(stripped)


def _slugify_value(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:140] or "product"


def _ensure_image_source(image_url: str) -> None:
    if image_url:
        return
    logger.warning("product payload rejected: missing image source")
    raise HTTPException(
        status_code=422,
        detail="Provide either a product image file in 'file' or a non-empty 'image_url'.",
    )


def _looks_like_uploaded_file(value: object) -> bool:
    filename = getattr(value, "filename", None)
    read_method = getattr(value, "read", None)
    return bool(filename) and callable(read_method)


def _log_multipart_debug(context: str, content_type: str, form: object, file_value: object) -> None:
    try:
        form_keys = list(form.keys()) if hasattr(form, "keys") else []
    except Exception:
        form_keys = []

    logger.warning(
        "multipart debug [%s]: content_type=%s form_keys=%s file_type=%s file_filename=%s file_content_type=%s looks_like_uploaded_file=%s",
        context,
        content_type,
        form_keys,
        type(file_value).__name__ if file_value is not None else None,
        getattr(file_value, "filename", None),
        getattr(file_value, "content_type", None),
        _looks_like_uploaded_file(file_value),
    )


def _uploaded_files_from_form(form: object) -> list[object]:
    files: list[object] = []
    if hasattr(form, "getlist"):
        for value in form.getlist("files"):
            if _looks_like_uploaded_file(value):
                files.append(value)
    single_file = form.get("file") if hasattr(form, "get") else None
    if _looks_like_uploaded_file(single_file):
        files.insert(0, single_file)
    return files


async def _upload_product_images(files: list[object]) -> list[str]:
    image_urls: list[str] = []
    for file in files[:12]:
        image_url, _ = await upload_product_image(file)
        image_urls.append(image_url)
    return image_urls


def _normalized_image_urls(*urls: str) -> list[str]:
    normalized: list[str] = []
    for url in urls:
        clean_url = str(url or "").strip()
        if clean_url and clean_url not in normalized:
            normalized.append(clean_url)
    return normalized[:12]


def _replace_product_images(db: Session, product: Product, image_urls: list[str]) -> None:
    db.query(ProductImage).filter(ProductImage.product_id == product.id).delete()
    for position, image_url in enumerate(image_urls[:12]):
        db.add(
            ProductImage(
                product_id=product.id,
                image_url=image_url,
                position=position,
                is_primary=position == 0,
            )
        )


async def parse_product_create_payload(request: Request) -> ProductCreate:
    content_type = request.headers.get("content-type", "")
    if "multipart/form-data" not in content_type:
        logger.warning("create product request received as non-multipart content_type=%s", content_type)
        try:
            payload = await request.json()
        except Exception as exc:
            logger.warning("create product json parse failed")
            raise HTTPException(status_code=400, detail="Invalid JSON payload") from exc

        try:
            product = ProductCreate.model_validate(payload)
            if not product.image_url and product.image_urls:
                product = product.model_copy(update={"image_url": product.image_urls[0]})
            logger.warning(
                "create product json payload parsed: slug=%s has_image_url=%s category=%s featured=%s",
                product.slug,
                bool(product.image_url),
                product.category,
                product.featured,
            )
            _ensure_image_source(product.image_url)
            return product
        except ValidationError as exc:
            logger.warning("create product json validation failed: errors=%s", exc.errors())
            raise HTTPException(status_code=422, detail=exc.errors()) from exc

    form = await request.form()
    image_url = str(form.get("image_url") or "").strip()
    file = form.get("file")
    _log_multipart_debug("create_product", content_type, form, file)
    uploaded_files = _uploaded_files_from_form(form)
    uploaded_image_urls: list[str] = []
    if uploaded_files:
        try:
            uploaded_image_urls = await _upload_product_images(uploaded_files)
            image_url = uploaded_image_urls[0]
        except (StorageConfigurationError, StorageUploadError) as exc:
            logger.exception("product image upload failed during create")
            raise HTTPException(status_code=503, detail=str(exc)) from exc
    else:
        logger.warning(
            "create product multipart has no recognized uploaded file: raw_file_type=%s raw_file_value=%s",
            type(file).__name__ if file is not None else None,
            str(file)[:200] if file is not None else None,
        )

    payload = {
        "name": str(form.get("name") or "").strip(),
        "slug": str(form.get("slug") or "").strip(),
        "description": str(form.get("description") or "").strip(),
        "price_cents": int(str(form.get("price_cents") or "0").strip() or "0"),
        "image_url": image_url,
        "category": str(form.get("category") or "").strip(),
        "material": str(form.get("material") or "").strip(),
        "collection_id": _parse_optional_int(str(form.get("collection_id")) if form.get("collection_id") is not None else None),
        "featured": _parse_bool(str(form.get("featured")) if form.get("featured") is not None else None),
        "in_stock": _parse_bool(str(form.get("in_stock"))) if form.get("in_stock") is not None else True,
        "stock_quantity": int(str(form.get("stock_quantity") or "1").strip() or "1"),
        "image_urls": _normalized_image_urls(image_url, *uploaded_image_urls),
    }
    if not payload["slug"]:
        payload["slug"] = _slugify_value(payload["name"])
    logger.warning(
        "create product multipart payload parsed: slug=%s has_image_url=%s image_url_length=%s category=%s featured=%s collection_id=%s",
        payload["slug"],
        bool(payload["image_url"]),
        len(payload["image_url"]),
        payload["category"],
        payload["featured"],
        payload["collection_id"],
    )

    try:
        product = ProductCreate.model_validate(payload)
        if not product.image_url and product.image_urls:
            product = product.model_copy(update={"image_url": product.image_urls[0]})
        _ensure_image_source(product.image_url)
        return product
    except ValidationError as exc:
        logger.warning("create product validation failed: errors=%s", exc.errors())
        raise HTTPException(status_code=422, detail=exc.errors()) from exc


async def parse_product_update_payload(request: Request) -> ProductUpdate:
    content_type = request.headers.get("content-type", "")
    if "multipart/form-data" not in content_type:
        logger.warning("update product request received as non-multipart content_type=%s", content_type)
        try:
            payload = await request.json()
        except Exception as exc:
            logger.warning("update product json parse failed")
            raise HTTPException(status_code=400, detail="Invalid JSON payload") from exc

        try:
            product_update = ProductUpdate.model_validate(payload)
            if not product_update.image_url and product_update.image_urls:
                product_update = product_update.model_copy(update={"image_url": product_update.image_urls[0]})
            return product_update
        except ValidationError as exc:
            logger.warning("update product json validation failed: errors=%s", exc.errors())
            raise HTTPException(status_code=422, detail=exc.errors()) from exc

    form = await request.form()
    file = form.get("file")
    _log_multipart_debug("update_product", content_type, form, file)
    updates: dict[str, object] = {}

    field_map = {
        "name": lambda v: v.strip(),
        "slug": lambda v: v.strip(),
        "description": lambda v: v.strip(),
        "price_cents": lambda v: int(v.strip() or "0"),
        "image_url": lambda v: v.strip(),
        "category": lambda v: v.strip(),
        "material": lambda v: v.strip(),
        "collection_id": _parse_optional_int,
        "featured": _parse_bool,
        "in_stock": _parse_bool,
        "stock_quantity": lambda v: int(v.strip() or "0"),
    }

    for field_name, parser in field_map.items():
        raw = form.get(field_name)
        if raw is None:
            continue
        raw_value = str(raw)
        parsed_value = parser(raw_value)
        if field_name == "image_url" and parsed_value == "":
            continue
        if field_name == "slug" and parsed_value == "":
            continue
        updates[field_name] = parsed_value

    uploaded_files = _uploaded_files_from_form(form)
    if uploaded_files:
        try:
            image_urls = await _upload_product_images(uploaded_files)
        except (StorageConfigurationError, StorageUploadError) as exc:
            logger.exception("product image upload failed during update")
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        updates["image_url"] = image_urls[0]
        updates["image_urls"] = image_urls
    else:
        logger.warning(
            "update product multipart has no recognized uploaded file: raw_file_type=%s raw_file_value=%s",
            type(file).__name__ if file is not None else None,
            str(file)[:200] if file is not None else None,
        )

    logger.warning(
        "update product multipart payload parsed: keys=%s has_image_url=%s image_url_length=%s",
        sorted(updates.keys()),
        bool(updates.get("image_url")),
        len(str(updates.get("image_url") or "")),
    )

    try:
        return ProductUpdate.model_validate(updates)
    except ValidationError as exc:
        logger.warning("update product validation failed: errors=%s", exc.errors())
        raise HTTPException(status_code=422, detail=exc.errors()) from exc


def parse_order_id_from_session(session: dict) -> int | None:
    metadata = session.get("metadata") or {}
    order_id = metadata.get("order_id")
    if not order_id:
        return None
    try:
        return int(order_id)
    except (TypeError, ValueError):
        return None


def sync_paid_checkout_session(session: dict) -> None:
    order_id = parse_order_id_from_session(session)
    if not order_id:
        return

    customer_details = session.get("customer_details") or {}
    shipping_details = session.get("shipping_details") or {}
    shipping_address = shipping_details.get("address") or {}

    mark_order_paid_from_checkout(
        order_id=order_id,
        stripe_session_id=session.get("id"),
        stripe_payment_intent_id=session.get("payment_intent"),
        customer_email=customer_details.get("email"),
        customer_name=customer_details.get("name"),
        customer_phone=customer_details.get("phone"),
        shipping_name=shipping_details.get("name") or customer_details.get("name"),
        shipping_line1=shipping_address.get("line1"),
        shipping_line2=shipping_address.get("line2"),
        shipping_city=shipping_address.get("city"),
        shipping_state=shipping_address.get("state"),
        shipping_postal_code=shipping_address.get("postal_code"),
        shipping_country=shipping_address.get("country"),
    )


def sync_failed_checkout_session(session: dict) -> None:
    order_id = parse_order_id_from_session(session)
    if not order_id:
        return
    mark_order_payment_failed(order_id=order_id, stripe_session_id=session.get("id"))


def sync_expired_checkout_session(session: dict) -> None:
    order_id = parse_order_id_from_session(session)
    if not order_id:
        return
    mark_order_expired(order_id=order_id, stripe_session_id=session.get("id"))


@router.get("/products", response_model=ProductListResponse)
def list_products(db: Session = Depends(get_db)) -> ProductListResponse:
    products = db.query(Product).order_by(Product.featured.desc(), Product.id.asc()).all()
    return ProductListResponse(items=products)


@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)) -> ProductResponse:
    return get_product_or_404(db, product_id)


@router.get("/products/slug/{slug}", response_model=ProductResponse)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)) -> ProductResponse:
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/stock-notifications", response_model=StockNotificationResponse, status_code=status.HTTP_201_CREATED)
def create_stock_notification(
    payload: StockNotificationCreate,
    db: Session = Depends(get_db),
) -> StockNotificationResponse:
    product = get_product_or_404(db, payload.product_id)
    if product.in_stock:
        raise HTTPException(status_code=409, detail="Product is already in stock")
    email = payload.email.strip().lower()
    existing = (
        db.query(StockNotification)
        .filter(StockNotification.product_id == product.id, StockNotification.email == email)
        .first()
    )
    if existing:
        return existing

    notification = StockNotification(product_id=product.id, email=email)
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


@router.get("/admin/products", response_model=ProductListResponse, dependencies=[Depends(require_admin)])
def admin_list_products(db: Session = Depends(get_db)) -> ProductListResponse:
    products = db.query(Product).order_by(Product.featured.desc(), Product.id.desc()).all()
    return ProductListResponse(items=products)


@router.get("/admin/collections", response_model=CollectionListResponse, dependencies=[Depends(require_admin)])
def admin_list_collections(db: Session = Depends(get_db)) -> CollectionListResponse:
    items = db.query(Collection).order_by(Collection.name.asc(), Collection.id.asc()).all()
    return CollectionListResponse(items=items)


@router.post(
    "/admin/collections",
    response_model=CollectionResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
def admin_create_collection(payload: CollectionCreate, db: Session = Depends(get_db)) -> CollectionResponse:
    ensure_unique_collection_slug(db, payload.slug)
    item = Collection(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch(
    "/admin/collections/{collection_id}",
    response_model=CollectionResponse,
    dependencies=[Depends(require_admin)],
)
def admin_update_collection(
    collection_id: int,
    payload: CollectionUpdate,
    db: Session = Depends(get_db),
) -> CollectionResponse:
    item = get_collection_or_404(db, collection_id)
    updates = payload.model_dump(exclude_unset=True)
    if "slug" in updates:
        ensure_unique_collection_slug(db, updates["slug"], current_collection_id=item.id)
    for field, value in updates.items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete(
    "/admin/collections/{collection_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
def admin_delete_collection(collection_id: int, db: Session = Depends(get_db)) -> Response:
    item = get_collection_or_404(db, collection_id)
    db.query(Product).filter(Product.collection_id == item.id).update({"collection_id": None})
    db.delete(item)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/admin/products",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def admin_create_product(request: Request, db: Session = Depends(get_db)) -> ProductResponse:
    payload = await parse_product_create_payload(request)
    if not payload.slug:
        payload = payload.model_copy(update={"slug": _slugify_value(payload.name)})
    if payload.stock_quantity == 0:
        payload = payload.model_copy(update={"in_stock": False})
    ensure_unique_slug(db, payload.slug)
    ensure_valid_collection(db, payload.collection_id)
    image_urls = _normalized_image_urls(payload.image_url, *payload.image_urls)
    product_data = payload.model_dump(exclude={"image_urls"})
    product_data["image_url"] = image_urls[0]
    product = Product(**product_data)
    db.add(product)
    db.flush()
    _replace_product_images(db, product, image_urls)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/admin/products/{product_id}", response_model=ProductResponse, dependencies=[Depends(require_admin)])
async def admin_update_product(product_id: int, request: Request, db: Session = Depends(get_db)) -> ProductResponse:
    payload = await parse_product_update_payload(request)
    product = get_product_or_404(db, product_id)
    updates = payload.model_dump(exclude_unset=True)
    image_urls = updates.pop("image_urls", None)
    if "slug" in updates:
        ensure_unique_slug(db, updates["slug"], current_product_id=product.id)
    if "collection_id" in updates:
        ensure_valid_collection(db, updates["collection_id"])
    if updates.get("stock_quantity") == 0:
        updates["in_stock"] = False
    elif "stock_quantity" in updates and updates["stock_quantity"] > 0 and updates.get("in_stock") is not False:
        updates["in_stock"] = True
    for field, value in updates.items():
        setattr(product, field, value)
    if image_urls:
        normalized_urls = _normalized_image_urls(*image_urls)
        if normalized_urls:
            product.image_url = normalized_urls[0]
            _replace_product_images(db, product, normalized_urls)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/admin/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def admin_delete_product(product_id: int, db: Session = Depends(get_db)) -> Response:
    product = get_product_or_404(db, product_id)
    try:
        db.query(ProductImage).filter(ProductImage.product_id == product.id).delete()
        db.delete(product)
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Product cannot be deleted because it is linked to one or more orders.",
        ) from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/admin/stock-notifications",
    response_model=StockNotificationListResponse,
    dependencies=[Depends(require_admin)],
)
def admin_list_stock_notifications(db: Session = Depends(get_db)) -> StockNotificationListResponse:
    notifications = db.query(StockNotification).order_by(StockNotification.id.desc()).all()
    return StockNotificationListResponse(items=notifications)


@router.post(
    "/admin/products/import-json",
    response_model=ProductImportResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
def admin_import_products(payload: ProductImportRequest, db: Session = Depends(get_db)) -> ProductImportResponse:
    seen_slugs: set[str] = set()
    created_products: list[Product] = []

    for item in payload.items:
        if item.slug in seen_slugs:
            raise HTTPException(status_code=409, detail=f"Duplicate slug '{item.slug}' in import payload")
        seen_slugs.add(item.slug)
        ensure_unique_slug(db, item.slug)
        ensure_valid_collection(db, item.collection_id)
        image_urls = _normalized_image_urls(item.image_url, *item.image_urls)
        product_data = item.model_dump(exclude={"image_urls"})
        product_data["image_url"] = image_urls[0]
        product = Product(**product_data)
        db.add(product)
        db.flush()
        _replace_product_images(db, product, image_urls)
        created_products.append(product)

    db.commit()
    for product in created_products:
        db.refresh(product)

    return ProductImportResponse(imported_count=len(created_products), items=created_products)


@router.get("/admin/discount-codes", response_model=DiscountCodeListResponse, dependencies=[Depends(require_admin)])
def admin_list_discount_codes(db: Session = Depends(get_db)) -> DiscountCodeListResponse:
    discounts = db.query(DiscountCode).order_by(DiscountCode.active.desc(), DiscountCode.id.desc()).all()
    return DiscountCodeListResponse(items=discounts)


@router.post(
    "/admin/discount-codes",
    response_model=DiscountCodeResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
def admin_create_discount_code(payload: DiscountCodeCreate, db: Session = Depends(get_db)) -> DiscountCodeResponse:
    ensure_unique_discount_code(db, payload.code)
    discount = DiscountCode(**payload.model_dump())
    db.add(discount)
    db.commit()
    db.refresh(discount)
    return discount


@router.patch(
    "/admin/discount-codes/{discount_id}",
    response_model=DiscountCodeResponse,
    dependencies=[Depends(require_admin)],
)
def admin_update_discount_code(
    discount_id: int,
    payload: DiscountCodeUpdate,
    db: Session = Depends(get_db),
) -> DiscountCodeResponse:
    discount = get_discount_or_404(db, discount_id)
    updates = payload.model_dump(exclude_unset=True)
    if "code" in updates:
        ensure_unique_discount_code(db, updates["code"], current_discount_id=discount.id)
    for field, value in updates.items():
        setattr(discount, field, value)
    db.commit()
    db.refresh(discount)
    return discount


@router.delete(
    "/admin/discount-codes/{discount_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
def admin_delete_discount_code(discount_id: int, db: Session = Depends(get_db)) -> Response:
    discount = get_discount_or_404(db, discount_id)
    db.delete(discount)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/checkout", response_model=CheckoutResponse)
def checkout(request: Request, payload: CheckoutRequest, db: Session = Depends(get_db)) -> CheckoutResponse:
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    product_ids = [item.product_id for item in payload.items]
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    product_map = {product.id: product for product in products}

    line_items: list[CheckoutItem] = []
    total_amount_cents = 0
    for item in payload.items:
        product = product_map.get(item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if not product.in_stock:
            raise HTTPException(status_code=422, detail=f"Product '{product.name}' is out of stock")
        if item.quantity > product.stock_quantity:
            raise HTTPException(
                status_code=422,
                detail=f"Only {product.stock_quantity} unit(s) available for '{product.name}'",
            )
        total_amount_cents += product.price_cents * item.quantity
        line_items.append(
            CheckoutItem(
                product_id=product.id,
                name=product.name,
                quantity=item.quantity,
                unit_amount_cents=product.price_cents,
                image_url=product.image_url,
            )
        )

    discount = active_discount_for_code(db, payload.discount_code)
    discount_amount_cents = 0
    if discount:
        discount_amount_cents = round(total_amount_cents * discount.percent_off / 100)
    final_total_amount_cents = max(total_amount_cents - discount_amount_cents, 0)

    order = create_order_record(
        email=payload.email or "guest@example.com",
        currency=settings.stripe_price_currency,
        total_amount_cents=final_total_amount_cents,
        items=[item.model_dump() for item in line_items],
        discount_code=discount.code if discount else None,
        discount_percent_off=discount.percent_off if discount else None,
        discount_amount_cents=discount_amount_cents,
    )

    try:
        base_path = checkout_base_path(payload.locale)
        origin = checkout_origin(request, payload.frontend_origin)
        checkout_url, stripe_session_id = create_checkout_session(
            items=line_items,
            success_url=f"{origin}{base_path}/checkout/success?order_id={order.id}",
            cancel_url=f"{origin}{base_path}/checkout/cancel",
            currency=settings.stripe_price_currency,
            order_id=order.id,
            customer_email=payload.email,
            discount_code=discount.code if discount else None,
            discount_percent_off=discount.percent_off if discount else None,
        )
    except StripeCheckoutConfigurationError as exc:
        raise HTTPException(
            status_code=503,
            detail="Stripe non e configurato. Inserisci una chiave STRIPE_SECRET_KEY valida nel backend.",
        ) from exc
    except StripeCheckoutRequestError as exc:
        raise HTTPException(status_code=502, detail=f"Errore Stripe: {exc}") from exc

    attach_stripe_session(order_id=order.id, stripe_session_id=stripe_session_id)
    return CheckoutResponse(order_id=order.id, url=checkout_url)


@router.post("/stripe/webhook", status_code=status.HTTP_200_OK)
async def stripe_webhook(request: Request) -> dict[str, bool]:
    if not settings.stripe_webhook_secret:
        raise HTTPException(status_code=503, detail="Stripe webhook secret is not configured")

    payload = await request.body()
    signature = request.headers.get("stripe-signature")
    if not signature:
        raise HTTPException(status_code=400, detail="Missing Stripe signature")

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=signature,
            secret=settings.stripe_webhook_secret,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid Stripe payload") from exc
    except SignatureVerificationError as exc:
        raise HTTPException(status_code=400, detail="Invalid Stripe signature") from exc

    session = event["data"]["object"]
    event_type = event["type"]

    if event_type in {"checkout.session.completed", "checkout.session.async_payment_succeeded"}:
        sync_paid_checkout_session(session)
    elif event_type == "checkout.session.async_payment_failed":
        sync_failed_checkout_session(session)
    elif event_type == "checkout.session.expired":
        sync_expired_checkout_session(session)

    return {"received": True}
