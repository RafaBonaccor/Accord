from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, default="guest@example.com")
    status: Mapped[str] = mapped_column(String(40), nullable=False, default="pending")
    total_amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), nullable=False)
    stripe_session_id: Mapped[str] = mapped_column(String(255), nullable=True)
    items_snapshot: Mapped[str] = mapped_column(Text, nullable=False)
