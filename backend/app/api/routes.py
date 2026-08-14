from fastapi import APIRouter, Depends, Header, HTTPException, Request, Response, status
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
from app.models.product import Product
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


def ensure_unique_slug(db: Session, slug: str, current_product_id: int | None = None) -> None:
    existing = db.query(Product).filter(Product.slug == slug).first()
    if existing and existing.id != current_product_id:
        raise HTTPException(status_code=409, detail=f"Slug '{slug}' already exists")


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


@router.post(
    "/admin/products",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
def admin_create_product(payload: ProductCreate, db: Session = Depends(get_db)) -> ProductResponse:
    ensure_unique_slug(db, payload.slug)
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/admin/products/{product_id}", response_model=ProductResponse, dependencies=[Depends(require_admin)])
def admin_update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db)) -> ProductResponse:
    product = get_product_or_404(db, product_id)
    updates = payload.model_dump(exclude_unset=True)
    if "slug" in updates:
        ensure_unique_slug(db, updates["slug"], current_product_id=product.id)
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
