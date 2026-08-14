import { Product } from "./types";

export function featuredProducts(products: Product[]): Product[] {
  return products.filter((product) => product.featured);
}

export function latestProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => b.id - a.id).slice(0, 8);
}

export function productsByCategory(products: Product[], category: string): Product[] {
  return products.filter((product) => product.category.toLowerCase() === category.toLowerCase());
}
