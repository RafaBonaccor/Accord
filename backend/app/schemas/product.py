from pydantic import BaseModel, ConfigDict, Field


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


class ProductListResponse(BaseModel):
    items: list[ProductResponse]


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    slug: str = Field(min_length=2, max_length=140)
    description: str = Field(min_length=8)
    price_cents: int = Field(ge=1)
    image_url: str = Field(min_length=8, max_length=500)
    category: str = Field(min_length=2, max_length=80)
    material: str = Field(min_length=2, max_length=80)
    collection_id: int | None = None
    featured: bool = False


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    slug: str | None = Field(default=None, min_length=2, max_length=140)
    description: str | None = Field(default=None, min_length=8)
    price_cents: int | None = Field(default=None, ge=1)
    image_url: str | None = Field(default=None, min_length=8, max_length=500)
    category: str | None = Field(default=None, min_length=2, max_length=80)
    material: str | None = Field(default=None, min_length=2, max_length=80)
    collection_id: int | None = None
    featured: bool | None = None


class ProductImportRequest(BaseModel):
    items: list[ProductCreate]


class ProductImportResponse(BaseModel):
    imported_count: int
    items: list[ProductResponse]
