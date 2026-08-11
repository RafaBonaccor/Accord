"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { storefrontCopy } from "../lib/copy";
import { Locale } from "../lib/i18n";
import { createCheckout } from "../lib/api";
import { CartItem, Product } from "../lib/types";
import styles from "./storefront.module.css";

const CART_STORAGE_KEY = "accordi-cart";

type Props = {
  products: Product[];
  locale: Locale;
};

export function Storefront({ products, locale }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [email, setEmail] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const featuredProducts = products.filter((product) => product.featured);
  const copy = storefrontCopy[locale];
  const englishSeoPath = "/italian-jewelry";
  const languageSwitchPath = locale === "it" ? "/en" : "/";

  useEffect(() => {
    const saved = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) {
      return;
    }
    try {
      setCart(JSON.parse(saved) as CartItem[]);
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (!existing) {
        return [...current, { product, quantity: 1 }];
      }
      return current.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  }

  function updateQuantity(productId: number, quantity: number) {
    setCart((current) =>
      current
        .map((item) => (item.product.id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    );
  }

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
      setCheckoutError(
        error instanceof Error ? error.message : copy.checkoutUnavailable,
      );
    } finally {
      setCheckoutPending(false);
    }
  }

  const total = cart.reduce((sum, item) => sum + item.product.price_cents * item.quantity, 0);

  return (
    <main className={styles.page} lang={locale}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1>{copy.heroTitle}</h1>
          <p className={styles.lead}>{copy.heroLead}</p>
          <div className={styles.heroActions}>
            <a href="#shop" className={styles.primaryLink}>
              {copy.primaryAction}
            </a>
            <a href="#campaign" className={styles.secondaryLink}>
              {copy.secondaryAction}
            </a>
            <a href={languageSwitchPath} className={styles.secondaryLink}>
              {copy.languageAction}
            </a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroVisualCard}>
            <span>{copy.heroCardLabel}</span>
            <strong>{copy.heroCardTitle}</strong>
            <p>{copy.heroCardBody}</p>
          </div>
        </div>
      </section>

      <section className={styles.categoryStrip}>
        {copy.categoryPills.map((pill) => (
          <div key={pill} className={styles.categoryPill}>
            {pill}
          </div>
        ))}
      </section>

      <div className={styles.contentLayout}>
        <div className={styles.catalogColumn}>
          <section id="campaign" className={styles.featureRow}>
            {featuredProducts.map((product) => (
              <article key={product.id} className={styles.featureCard}>
                <div className={styles.featureImageWrap}>
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.featureCardBody}>
                  <p className={styles.meta}>
                    {product.category} · {product.material}
                  </p>
                  <h2>{product.name}</h2>
                  <p className={styles.description}>{product.description}</p>
                  <div className={styles.cardFooter}>
                    <span>€ {(product.price_cents / 100).toFixed(2)}</span>
                    <button type="button" onClick={() => addToCart(product)}>
                      {copy.addToCart}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section id="shop" className={styles.gridSection}>
            <div className={styles.sectionHeader}>
              <h2>{copy.shopTitle}</h2>
              <p>{copy.shopBody}</p>
            </div>
            <div className={styles.grid}>
              {products.map((product) => (
                <article key={product.id} className={styles.card}>
                  <div className={styles.imageWrap}>
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <div>
                      <p className={styles.meta}>
                        {product.category} · {product.material}
                      </p>
                      <h3>{product.name}</h3>
                    </div>
                    <div className={styles.cardFooter}>
                      <span>€ {(product.price_cents / 100).toFixed(2)}</span>
                      <button type="button" onClick={() => addToCart(product)}>
                        {copy.addToCart}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.seoSection}>
            <div className={styles.seoTextBlock}>
              <p className={styles.meta}>{copy.seoMeta}</p>
              <h2>{copy.seoTitle}</h2>
              <p className={styles.description}>{copy.seoBody}</p>
            </div>
            <div className={styles.seoPoints}>
              {copy.seoPoints.map((point) => (
                <div key={point.title}>
                  <strong>{point.title}</strong>
                  <p>{point.body}</p>
                </div>
              ))}
            </div>
            <div className={styles.seoLinks}>
              <a href={englishSeoPath}>{copy.seoLinkLabel}</a>
            </div>
          </section>
        </div>

        <aside id="cart" className={styles.cart}>
          <div className={styles.cartHeader}>
            <h2>{copy.cartTitle}</h2>
            <span>{copy.cartItems(cart.length)}</span>
          </div>

          <div className={styles.cartItems}>
            {cart.length === 0 ? (
              <p className={styles.empty}>{copy.cartEmpty}</p>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className={styles.cartItem}>
                  <div>
                    <strong>{item.product.name}</strong>
                    <p>€ {(item.product.price_cents / 100).toFixed(2)}</p>
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
                </div>
              ))
            )}
          </div>

          <div className={styles.cartFooter}>
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
              <strong>€ {(total / 100).toFixed(2)}</strong>
            </div>
            {checkoutError ? <p className={styles.checkoutError}>{checkoutError}</p> : null}
            <button
              type="button"
              className={styles.checkoutButton}
              onClick={handleCheckout}
              disabled={cart.length === 0 || checkoutPending}
            >
              {checkoutPending ? copy.checkoutPending : copy.checkoutAction}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
