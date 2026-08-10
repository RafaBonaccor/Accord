from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

id_type = BigInteger().with_variant(Integer, "sqlite")


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(id_type, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, default="guest@example.com")
    status: Mapped[str] = mapped_column(String(40), nullable=False, default="pending")
    total_amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), nullable=False)
    stripe_session_id: Mapped[str] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
