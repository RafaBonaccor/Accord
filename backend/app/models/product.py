from datetime import datetime

from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

id_type = BigInteger().with_variant(Integer, "sqlite")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(id_type, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(140), unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    material: Mapped[str] = mapped_column(String(80), nullable=False)
    collection_id: Mapped[int | None] = mapped_column(ForeignKey("collections.id"), nullable=True, index=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    in_stock: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    stock_quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
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

    collection = relationship("Collection", back_populates="products")
    product_images = relationship(
        "ProductImage",
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="ProductImage.position",
    )
    stock_notifications = relationship("StockNotification", back_populates="product", cascade="all, delete-orphan")

    @property
    def collection_name(self) -> str | None:
        return self.collection.name if self.collection else None

    @property
    def collection_slug(self) -> str | None:
        return self.collection.slug if self.collection else None

    @property
    def images(self) -> list[dict[str, object]]:
        if self.product_images:
            return [
                {
                    "id": image.id,
                    "image_url": image.image_url,
                    "position": image.position,
                    "is_primary": image.is_primary,
                }
                for image in self.product_images
            ]

        return [
            {
                "id": None,
                "image_url": self.image_url,
                "position": 0,
                "is_primary": True,
            }
        ]
