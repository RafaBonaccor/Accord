"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { createStockNotification } from "../lib/api";
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
    outOfStock: "Out of stock",
    notifyTitle: "Avvisami quando sara disponibile",
    notifyEmail: "La tua email",
    notifyPlaceholder: "cliente@accordi.com",
    notifyAction: "Avvisami",
    notifyPending: "Salvataggio...",
    notifySuccess: "Ti avviseremo appena torna disponibile.",
    notifyError: "Non siamo riusciti a salvare la richiesta. Riprova.",
  },
  en: {
    addToCart: "Add to cart",
    buyNow: "Go to checkout",
    added: "Product added to cart.",
    outOfStock: "Out of stock",
    notifyTitle: "Notify me when available",
    notifyEmail: "Your email",
    notifyPlaceholder: "customer@accordi.com",
    notifyAction: "Notify me",
    notifyPending: "Saving...",
    notifySuccess: "We will notify you as soon as it is available.",
    notifyError: "We could not save the request. Please try again.",
  },
} as const;

export function ProductPurchaseActions({ locale, product }: Props) {
  const labels = copy[locale];
  const unavailable = product.in_stock === false || (product.stock_quantity ?? 1) <= 0;
  const [added, setAdded] = useState(false);
  const [email, setEmail] = useState("");
  const [notifyPending, setNotifyPending] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState<string | null>(null);
  const [notifyError, setNotifyError] = useState<string | null>(null);

  function handleAddToCart() {
    if (unavailable) {
      return;
    }
    addProductToCart(product);
    setAdded(true);
  }

  function handleBuyNow() {
    if (unavailable) {
      return;
    }
    addProductToCart(product);
    window.location.href = locale === "en" ? "/en/cart" : "/cart";
  }

  async function handleNotifySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotifyPending(true);
    setNotifyMessage(null);
    setNotifyError(null);
    try {
      await createStockNotification(product.id, email, locale);
      setNotifyMessage(labels.notifySuccess);
      setEmail("");
    } catch {
      setNotifyError(labels.notifyError);
    } finally {
      setNotifyPending(false);
    }
  }

  if (unavailable) {
    return (
      <form className={styles.notifyForm} onSubmit={handleNotifySubmit}>
        <p className={styles.stockNotice}>{labels.outOfStock}</p>
        <strong>{labels.notifyTitle}</strong>
        <label>
          <span>{labels.notifyEmail}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={labels.notifyPlaceholder}
          />
        </label>
        <button type="submit" className={styles.checkoutButton} disabled={notifyPending}>
          {notifyPending ? labels.notifyPending : labels.notifyAction}
        </button>
        {notifyMessage ? <p className={styles.purchaseNote}>{notifyMessage}</p> : null}
        {notifyError ? <p className={styles.purchaseError}>{notifyError}</p> : null}
      </form>
    );
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
