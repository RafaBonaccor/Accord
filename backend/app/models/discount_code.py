from datetime import datetime

from sqlalchemy import BigInteger, Boolean, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

id_type = BigInteger().with_variant(Integer, "sqlite")


class DiscountCode(Base):
    __tablename__ = "discount_codes"

    id: Mapped[int] = mapped_column(id_type, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(80), unique=True, nullable=False, index=True)
    percent_off: Mapped[int] = mapped_column(Integer, nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    max_redemptions: Mapped[int | None] = mapped_column(Integer, nullable=True)
    redeemed_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    starts_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
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
