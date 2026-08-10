from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import attach_stripe_session, create_order_record, get_db
from app.models.product import Product
from app.schemas.checkout import CheckoutItem, CheckoutRequest, CheckoutResponse
from app.schemas.product import ProductListResponse, ProductResponse
from app.services.stripe_service import (
    StripeCheckoutConfigurationError,
    StripeCheckoutRequestError,
    create_checkout_session,
)

router = APIRouter()


@router.get("/products", response_model=ProductListResponse)
def list_products(db: Session = Depends(get_db)) -> ProductListResponse:
    products = db.query(Product).order_by(Product.featured.desc(), Product.id.asc()).all()
    return ProductListResponse(items=products)


@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)) -> ProductResponse:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


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
        checkout_url, stripe_session_id = create_checkout_session(
            items=line_items,
            success_url=f"{settings.frontend_url}/checkout/success?order_id={order.id}",
            cancel_url=f"{settings.frontend_url}/checkout/cancel",
            currency=settings.stripe_price_currency,
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
