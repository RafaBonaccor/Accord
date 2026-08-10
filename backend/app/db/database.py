import json

from sqlalchemy import create_engine
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


def create_order_record(*, email: str, currency: str, items: list[dict], total_amount_cents: int) -> Order:
    db = SessionLocal()
    try:
        order = Order(
            email=email,
            status="pending",
            total_amount_cents=total_amount_cents,
            currency=currency,
            items_snapshot=json.dumps(items),
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
