"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "../hooks/use-cart";
import { createCheckout } from "../lib/api";
import { storefrontCopy } from "../lib/copy";
import { Locale } from "../lib/i18n";
import { productPath } from "../lib/product-routes";
import styles from "./storefront.module.css";

type Props = {
  locale: Locale;
  continueHref: string;
  standalone?: boolean;
};

export function ShoppingBag({ locale, continueHref, standalone = false }: Props) {
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [email, setEmail] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const { cart, itemCount, totalPriceCents, updateQuantity, removeFromCart, clearCart } = useCart();
  const copy = storefrontCopy[locale];

  async function handleCheckout() {
    try {
      setCheckoutError(null);
      setCheckoutPending(true);
      const url = await createCheckout(
        cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        locale,
        email || undefined,
      );
      window.location.href = url;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : copy.checkoutUnavailable);
    } finally {
      setCheckoutPending(false);
    }
  }

  const content = (
    <>
      <div className={styles.cartHeader}>
        <h2>{copy.cartTitle}</h2>
        <span>{copy.cartItems(itemCount)}</span>
      </div>

      <div className={styles.cartIntro}>
        <strong>{copy.cartSummaryTitle}</strong>
        <p>{copy.cartSummaryBody}</p>
      </div>

      <div className={styles.cartItems}>
        {cart.length === 0 ? (
          <p className={styles.empty}>{copy.cartEmpty}</p>
        ) : (
          cart.map((item) => (
            <article key={item.product.id} className={styles.cartItem}>
              <Link
                href={productPath(locale, item.product.slug)}
                className={styles.cartThumb}
                aria-label={item.product.name}
              >
                <Image
                  src={item.product.image_url}
                  alt={item.product.name}
                  fill
                  sizes="96px"
                  className={styles.productImage}
                />
              </Link>
              <div className={styles.cartItemBody}>
                <div className={styles.cartItemCopy}>
                  <p className={styles.cartItemMeta}>
                    {item.product.category} · {item.product.material}
                  </p>
                  <strong>{item.product.name}</strong>
                  <p className={styles.cartItemDescription}>{item.product.description}</p>
                </div>
                <div className={styles.cartItemFooter}>
                  <div className={styles.cartPriceBlock}>
                    <span>{copy.cartSubtotal}</span>
                    <strong>€ {((item.product.price_cents * item.quantity) / 100).toFixed(2)}</strong>
                  </div>
                  <button
                    type="button"
                    className={styles.cartRemove}
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    {copy.cartRemove}
                  </button>
                </div>
              </div>
              <div className={styles.qtyControls}>
                <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                  +
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <div className={styles.cartFooter}>
        <div className={styles.cartUtilityRow}>
          <span>{copy.cartTotalItems(itemCount)}</span>
          {cart.length > 0 ? (
            <button type="button" className={styles.cartClear} onClick={() => clearCart()}>
              {copy.cartClear}
            </button>
          ) : null}
        </div>
        <label className={styles.emailField}>
          <span>{copy.orderEmail}</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={copy.orderEmailPlaceholder}
          />
        </label>
        <div className={styles.totalRow}>
          <span>{copy.totalLabel}</span>
          <strong>€ {(totalPriceCents / 100).toFixed(2)}</strong>
        </div>
        {checkoutError ? <p className={styles.checkoutError}>{checkoutError}</p> : null}
        <div className={styles.cartActions}>
          <Link href={continueHref} className={styles.cartContinue}>
            {copy.cartContinue}
          </Link>
          <button
            type="button"
            className={styles.checkoutButton}
            onClick={handleCheckout}
            disabled={cart.length === 0 || checkoutPending}
          >
            {checkoutPending ? copy.checkoutPending : copy.checkoutAction}
          </button>
        </div>
      </div>
    </>
  );

  if (!standalone) {
    return (
      <aside id="cart" className={styles.cart}>
        {content}
      </aside>
    );
  }

  return (
    <main className={styles.cartPage} lang={locale}>
      <div className={styles.cartPageInner}>
        <section className={styles.cartStandalone}>{content}</section>
      </div>
    </main>
  );
}
