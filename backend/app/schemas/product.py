from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProductImageResponse(BaseModel):
    id: int | None = None
    image_url: str
    position: int
    is_primary: bool


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: str
    price_cents: int
    image_url: str
    category: str
    material: str
    collection_id: int | None
    collection_name: str | None
    collection_slug: str | None
    featured: bool
    in_stock: bool
    stock_quantity: int
    notify_request_count: int
    images: list[ProductImageResponse] = Field(default_factory=list)


class ProductListResponse(BaseModel):
    items: list[ProductResponse]


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    slug: str = Field(default="", max_length=140)
    description: str = Field(default="")
    price_cents: int = Field(ge=1)
    image_url: str = Field(default="", max_length=500)
    category: str = Field(min_length=2, max_length=80)
    material: str = Field(default="", max_length=80)
    collection_id: int | None = None
    featured: bool = False
    in_stock: bool = True
    stock_quantity: int = Field(default=1, ge=0)
    image_urls: list[str] = Field(default_factory=list, max_length=12)


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    slug: str | None = Field(default=None, max_length=140)
    description: str | None = Field(default=None)
    price_cents: int | None = Field(default=None, ge=1)
    image_url: str | None = Field(default=None, max_length=500)
    category: str | None = Field(default=None, min_length=2, max_length=80)
    material: str | None = Field(default=None, max_length=80)
    collection_id: int | None = None
    featured: bool | None = None
    in_stock: bool | None = None
    stock_quantity: int | None = Field(default=None, ge=0)
    image_urls: list[str] | None = Field(default=None, max_length=12)


class ProductImportRequest(BaseModel):
    items: list[ProductCreate]


class ProductImportResponse(BaseModel):
    imported_count: int
    items: list[ProductResponse]


class StockNotificationCreate(BaseModel):
    product_id: int
    email: str = Field(min_length=5, max_length=255)
    locale: str = Field(default="it", pattern="^(it|en)$")

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if "@" not in normalized or "." not in normalized.rsplit("@", 1)[-1]:
            raise ValueError("Invalid email address")
        return normalized


class StockNotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    product_name: str | None = None
    email: str
    status: str


class StockNotificationListResponse(BaseModel):
    items: list[StockNotificationResponse]
