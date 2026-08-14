"use client";

import { useEffect, useState } from "react";

import {
  addProductToCart,
  clearCart,
  getCartQuantity,
  getCartTotal,
  readCart,
  removeProductFromCart,
  subscribeCart,
  updateProductQuantity,
} from "../lib/cart";
import { CartItem, Product } from "../lib/types";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(readCart());
    return subscribeCart(setCart);
  }, []);

  return {
    cart,
    itemCount: getCartQuantity(cart),
    totalPriceCents: getCartTotal(cart),
    addToCart: (product: Product, quantity?: number) => addProductToCart(product, quantity),
    updateQuantity: (productId: number, quantity: number) => updateProductQuantity(productId, quantity),
    removeFromCart: (productId: number) => removeProductFromCart(productId),
    clearCart,
  };
}
