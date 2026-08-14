"use client";

import { useState } from "react";

import { addProductToCart } from "../lib/cart";
import { Locale } from "../lib/i18n";
import { Product } from "../lib/types";
import styles from "./product-detail-page.module.css";

type Props = {
  locale: Locale;
  product: Product;
};

const copy = {
  it: {
    addToCart: "Aggiungi al carrello",
    buyNow: "Vai al checkout",
    added: "Prodotto aggiunto al carrello.",
  },
  en: {
    addToCart: "Add to cart",
    buyNow: "Go to checkout",
    added: "Product added to cart.",
  },
} as const;

export function ProductPurchaseActions({ locale, product }: Props) {
  const labels = copy[locale];
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addProductToCart(product);
    setAdded(true);
  }

  function handleBuyNow() {
    addProductToCart(product);
    window.location.href = locale === "en" ? "/en/cart" : "/cart";
  }

  return (
    <div className={styles.purchaseBlock}>
      <div className={styles.purchaseActions}>
        <button type="button" className={styles.buyButton} onClick={handleAddToCart}>
          {labels.addToCart}
        </button>
        <button type="button" className={styles.checkoutButton} onClick={handleBuyNow}>
          {labels.buyNow}
        </button>
      </div>
      {added ? <p className={styles.purchaseNote}>{labels.added}</p> : null}
    </div>
  );
}
