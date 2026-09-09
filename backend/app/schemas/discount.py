from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


def normalize_discount_code(value: str) -> str:
    return value.strip().upper()


class DiscountCodeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    percent_off: int
    active: bool
    max_redemptions: int | None
    redeemed_count: int
    starts_at: datetime | None
    expires_at: datetime | None


class DiscountCodeListResponse(BaseModel):
    items: list[DiscountCodeResponse]


class DiscountCodeCreate(BaseModel):
    code: str = Field(min_length=2, max_length=80)
    percent_off: int = Field(ge=1, le=100)
    active: bool = True
    max_redemptions: int | None = Field(default=None, ge=1)
    starts_at: datetime | None = None
    expires_at: datetime | None = None

    @field_validator("code")
    @classmethod
    def normalize_code(cls, value: str) -> str:
        return normalize_discount_code(value)


class DiscountCodeUpdate(BaseModel):
    code: str | None = Field(default=None, min_length=2, max_length=80)
    percent_off: int | None = Field(default=None, ge=1, le=100)
    active: bool | None = None
    max_redemptions: int | None = Field(default=None, ge=1)
    starts_at: datetime | None = None
    expires_at: datetime | None = None

    @field_validator("code")
    @classmethod
    def normalize_code(cls, value: str | None) -> str | None:
        return normalize_discount_code(value) if value is not None else None
