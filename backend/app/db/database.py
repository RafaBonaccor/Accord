from datetime import datetime, timezone

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_products() -> None:
    seed_data = [
        {
            "name": "Luna Pavé Ring",
            "slug": "luna-pave-ring",
            "description": "Anello con pavé luminoso e finitura dorata satinata.",
            "price_cents": 12900,
            "image_url": "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
            "category": "Rings",
            "material": "Gold Vermeil",
            "featured": True,
        },
        {
            "name": "Aurora Tennis Bracelet",
            "slug": "aurora-tennis-bracelet",
            "description": "Bracciale elegante con zirconi e chiusura di sicurezza.",
            "price_cents": 18900,
            "image_url": "https://images.unsplash.com/photo-1601821765780-754fa98637c1?auto=format&fit=crop&w=900&q=80",
            "category": "Bracelets",
            "material": "Sterling Silver",
            "featured": True,
        },
        {
            "name": "Velvet Heart Charm",
            "slug": "velvet-heart-charm",
            "description": "Charm a cuore con smalto rosato pensato per composizioni modulari.",
            "price_cents": 5900,
            "image_url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
            "category": "Charms",
            "material": "Rose Gold",
            "featured": False,
        },
        {
            "name": "Sculpted Halo Earrings",
            "slug": "sculpted-halo-earrings",
            "description": "Orecchini a cerchio dal profilo scultoreo per look quotidiano.",
            "price_cents": 9900,
            "image_url": "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=900&q=80",
            "category": "Earrings",
            "material": "Gold Plated",
            "featured": False,
        },
    ]

    db = SessionLocal()
    try:
        existing = db.query(Product).count()
        if existing:
            return
        for item in seed_data:
            db.add(Product(**item))
        db.commit()
    finally:
        db.close()


def ensure_schema_extensions() -> None:
    inspector = inspect(engine)
    if "orders" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("orders")}
    dialect = engine.dialect.name
    timestamp_type = "TIMESTAMPTZ" if dialect == "postgresql" else "DATETIME"
    additions = {
        "stripe_payment_intent_id": "VARCHAR(255)",
        "customer_name": "VARCHAR(255)",
        "customer_phone": "VARCHAR(64)",
        "shipping_name": "VARCHAR(255)",
        "shipping_line1": "VARCHAR(255)",
        "shipping_line2": "VARCHAR(255)",
        "shipping_city": "VARCHAR(120)",
        "shipping_state": "VARCHAR(120)",
        "shipping_postal_code": "VARCHAR(40)",
        "shipping_country": "VARCHAR(8)",
        "paid_at": timestamp_type,
    }

    with engine.begin() as connection:
        for column_name, column_type in additions.items():
            if column_name in existing_columns:
                continue
            connection.execute(text(f"ALTER TABLE orders ADD COLUMN {column_name} {column_type}"))


def create_order_record(*, email: str, currency: str, items: list[dict], total_amount_cents: int) -> Order:
    db = SessionLocal()
    try:
        order = Order(
            email=email,
            status="pending",
            total_amount_cents=total_amount_cents,
            currency=currency,
        )
        db.add(order)
        db.flush()

        for item in items:
            db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=item["product_id"],
                    product_name=item["name"],
                    unit_amount_cents=item["unit_amount_cents"],
                    quantity=item["quantity"],
                    image_url=item["image_url"],
                )
            )

        db.commit()
        db.refresh(order)
        return order
    finally:
        db.close()


def attach_stripe_session(*, order_id: int, stripe_session_id: str) -> None:
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return
        order.stripe_session_id = stripe_session_id
        db.commit()
    finally:
        db.close()


def mark_order_paid_from_checkout(
    *,
    order_id: int,
    stripe_session_id: str | None,
    stripe_payment_intent_id: str | None,
    customer_email: str | None,
    customer_name: str | None,
    customer_phone: str | None,
    shipping_name: str | None,
    shipping_line1: str | None,
    shipping_line2: str | None,
    shipping_city: str | None,
    shipping_state: str | None,
    shipping_postal_code: str | None,
    shipping_country: str | None,
) -> None:
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return
        order.status = "paid"
        order.stripe_session_id = stripe_session_id or order.stripe_session_id
        order.stripe_payment_intent_id = stripe_payment_intent_id
        order.email = customer_email or order.email
        order.customer_name = customer_name
        order.customer_phone = customer_phone
        order.shipping_name = shipping_name
        order.shipping_line1 = shipping_line1
        order.shipping_line2 = shipping_line2
        order.shipping_city = shipping_city
        order.shipping_state = shipping_state
        order.shipping_postal_code = shipping_postal_code
        order.shipping_country = shipping_country
        order.paid_at = datetime.now(timezone.utc)
        db.commit()
    finally:
        db.close()


def mark_order_payment_failed(*, order_id: int, stripe_session_id: str | None) -> None:
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return
        order.status = "payment_failed"
        order.stripe_session_id = stripe_session_id or order.stripe_session_id
        db.commit()
    finally:
        db.close()


def mark_order_expired(*, order_id: int, stripe_session_id: str | None) -> None:
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return
        order.status = "expired"
        order.stripe_session_id = stripe_session_id or order.stripe_session_id
        db.commit()
    finally:
        db.close()
