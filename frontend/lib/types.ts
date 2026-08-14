export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  image_url: string;
  category: string;
  material: string;
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
  featured: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
