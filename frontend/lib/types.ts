export type ProductImage = {
  id: number | null;
  image_url: string;
  position: number;
  is_primary: boolean;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  image_url: string;
  category: string;
  material: string;
  collection_id: number | null;
  collection_name: string | null;
  collection_slug: string | null;
  featured: boolean;
  images: ProductImage[];
};

export type ProductInput = {
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  image_url: string;
  category: string;
  material: string;
  collection_id: number | null;
  featured: boolean;
  image_urls?: string[];
};

export type Collection = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

export type CollectionInput = {
  name: string;
  slug: string;
  description: string;
};

export type DiscountCode = {
  id: number;
  code: string;
  percent_off: number;
  active: boolean;
  max_redemptions: number | null;
  redeemed_count: number;
  starts_at: string | null;
  expires_at: string | null;
};

export type DiscountCodeInput = {
  code: string;
  percent_off: number;
  active: boolean;
  max_redemptions: number | null;
  starts_at: string | null;
  expires_at: string | null;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
