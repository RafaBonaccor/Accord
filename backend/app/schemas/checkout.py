from pydantic import BaseModel, Field


class CheckoutRequestItem(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1, le=10)


class CheckoutRequest(BaseModel):
    email: str | None = None
    locale: str | None = None
    items: list[CheckoutRequestItem]


class CheckoutItem(BaseModel):
    product_id: int
    name: str
    quantity: int
    unit_amount_cents: int
    image_url: str


class CheckoutResponse(BaseModel):
    order_id: int
    url: str
