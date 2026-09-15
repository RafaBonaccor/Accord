from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

id_type = BigInteger().with_variant(Integer, "sqlite")


class StockNotification(Base):
    __tablename__ = "stock_notifications"
    __table_args__ = (UniqueConstraint("product_id", "email", name="uq_stock_notifications_product_email"),)

    id: Mapped[int] = mapped_column(id_type, primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(40), nullable=False, default="pending")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    product = relationship("Product", back_populates="stock_notifications")

    @property
    def product_name(self) -> str | None:
        return self.product.name if self.product else None
