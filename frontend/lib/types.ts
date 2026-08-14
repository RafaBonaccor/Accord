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

export type CartItem = {
  product: Product;
  quantity: number;
};
