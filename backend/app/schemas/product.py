from pydantic import BaseModel, ConfigDict


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
    featured: bool


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
