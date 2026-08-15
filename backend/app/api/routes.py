from fastapi import APIRouter, Depends, Header, HTTPException, Request, Response, UploadFile, status
from pydantic import ValidationError
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
from app.models.product import Product
from app.schemas.collection import (
    CollectionCreate,
    CollectionListResponse,
    CollectionResponse,
    CollectionUpdate,
)
from app.schemas.checkout import CheckoutItem, CheckoutRequest, CheckoutResponse
from app.schemas.product import (
    ProductCreate,
    ProductImportRequest,
    ProductImportResponse,
    ProductListResponse,
    ProductResponse,
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


def checkout_base_path(locale: str | None) -> str:
    return "/en" if locale == "en" else ""


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


def _ensure_image_source(image_url: str) -> None:
    if image_url:
        return
    raise HTTPException(
        status_code=422,
        detail="Provide either a product image file in 'file' or a non-empty 'image_url'.",
    )


async def parse_product_create_payload(request: Request) -> ProductCreate:
    content_type = request.headers.get("content-type", "")
    if "multipart/form-data" not in content_type:
        payload = await request.json()
        product = ProductCreate.model_validate(payload)
        _ensure_image_source(product.image_url)
        return product

    form = await request.form()
    image_url = str(form.get("image_url") or "").strip()
    file = form.get("file")
    if isinstance(file, UploadFile) and file.filename:
        try:
            image_url, _ = await upload_product_image(file)
        except (StorageConfigurationError, StorageUploadError) as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc

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
    }

    try:
        product = ProductCreate.model_validate(payload)
        _ensure_image_source(product.image_url)
        return product
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=exc.errors()) from exc


async def parse_product_update_payload(request: Request) -> ProductUpdate:
    content_type = request.headers.get("content-type", "")
    if "multipart/form-data" not in content_type:
        payload = await request.json()
        return ProductUpdate.model_validate(payload)

    form = await request.form()
    file = form.get("file")
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
    }

    for field_name, parser in field_map.items():
        raw = form.get(field_name)
        if raw is None:
            continue
        raw_value = str(raw)
        parsed_value = parser(raw_value)
        if field_name == "image_url" and parsed_value == "":
            continue
        updates[field_name] = parsed_value

    if isinstance(file, UploadFile) and file.filename:
        try:
            image_url, _ = await upload_product_image(file)
        except (StorageConfigurationError, StorageUploadError) as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        updates["image_url"] = image_url

    try:
        return ProductUpdate.model_validate(updates)
    except ValidationError as exc:
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
    ensure_unique_slug(db, payload.slug)
    ensure_valid_collection(db, payload.collection_id)
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/admin/products/{product_id}", response_model=ProductResponse, dependencies=[Depends(require_admin)])
async def admin_update_product(product_id: int, request: Request, db: Session = Depends(get_db)) -> ProductResponse:
    payload = await parse_product_update_payload(request)
    product = get_product_or_404(db, product_id)
    updates = payload.model_dump(exclude_unset=True)
    if "slug" in updates:
        ensure_unique_slug(db, updates["slug"], current_product_id=product.id)
    if "collection_id" in updates:
        ensure_valid_collection(db, updates["collection_id"])
    for field, value in updates.items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/admin/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def admin_delete_product(product_id: int, db: Session = Depends(get_db)) -> Response:
    product = get_product_or_404(db, product_id)
    db.delete(product)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


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
        product = Product(**item.model_dump())
        db.add(product)
        created_products.append(product)

    db.commit()
    for product in created_products:
        db.refresh(product)

    return ProductImportResponse(imported_count=len(created_products), items=created_products)


@router.post("/checkout", response_model=CheckoutResponse)
def checkout(payload: CheckoutRequest, db: Session = Depends(get_db)) -> CheckoutResponse:
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

    order = create_order_record(
        email=payload.email or "guest@example.com",
        currency=settings.stripe_price_currency,
        total_amount_cents=total_amount_cents,
        items=[item.model_dump() for item in line_items],
    )

    try:
        base_path = checkout_base_path(payload.locale)
        checkout_url, stripe_session_id = create_checkout_session(
            items=line_items,
            success_url=f"{settings.frontend_url}{base_path}/checkout/success?order_id={order.id}",
            cancel_url=f"{settings.frontend_url}{base_path}/checkout/cancel",
            currency=settings.stripe_price_currency,
            order_id=order.id,
            customer_email=payload.email,
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
