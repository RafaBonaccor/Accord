"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { createCheckout } from "../lib/api";
import { CartItem, Product } from "../lib/types";
import styles from "./storefront.module.css";

const CART_STORAGE_KEY = "accordi-cart";

type Props = {
  products: Product[];
};

export function Storefront({ products }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [email, setEmail] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const featuredProducts = products.filter((product) => product.featured);

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
        email || undefined,
      );
      window.location.href = url;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Checkout non disponibile");
    } finally {
      setCheckoutPending(false);
    }
  }

  const total = cart.reduce((sum, item) => sum + item.product.price_cents * item.quantity, 0);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Italian Jewelry · Gioielli Italiani</p>
          <h1>Italian jewelry online tra charm, anelli e bracciali da regalare.</h1>
          <p className={styles.lead}>
            Accordi Jewelry propone una selezione di Italian jewelry e gioielli donna online con
            stile premium, design contemporaneo e una base e-commerce pronta per il mercato
            italiano e per ricerche internazionali in inglese.
          </p>
          <div className={styles.heroActions}>
            <a href="#shop" className={styles.primaryLink}>
              Acquista ora
            </a>
            <a href="#campaign" className={styles.secondaryLink}>
              Scopri la collezione
            </a>
            <a href="/italian-jewelry" className={styles.secondaryLink}>
              English page
            </a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroVisualCard}>
            <span>Best gift edit</span>
            <strong>Shine in layers</strong>
            <p>Mix di metalli caldi, charm iconici e silhouette pulite.</p>
          </div>
        </div>
      </section>

      <section className={styles.categoryStrip}>
        <div className={styles.categoryPill}>Charm da collezione</div>
        <div className={styles.categoryPill}>Bracciali iconici</div>
        <div className={styles.categoryPill}>Anelli luminosi</div>
        <div className={styles.categoryPill}>Gift sets</div>
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
                      Aggiungi
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section id="shop" className={styles.gridSection}>
            <div className={styles.sectionHeader}>
              <h2>Shop all jewelry</h2>
              <p>Database prodotti FastAPI + SQLite, pronto per estensione catalogo.</p>
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
                        Aggiungi
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.seoSection}>
            <div className={styles.seoTextBlock}>
              <p className={styles.meta}>Gioielleria online italiana · Italian jewelry</p>
              <h2>Acquista gioielli donna online con un’identita italiana chiara e rilevanza internazionale.</h2>
              <p className={styles.description}>
                Questa homepage e pensata per intercettare ricerche come gioielli italiani,
                gioielli donna online, italian jewelry, italian jewelry online, charm eleganti,
                anelli da regalo e bracciali premium. Il tono visivo e commerciale aiuta il
                posizionamento del brand su un target femminile interessato a gifting,
                collezioni stagionali e acquisto diretto sia in italiano sia in inglese.
              </p>
            </div>
            <div className={styles.seoPoints}>
              <div>
                <strong>Keyword focus</strong>
                <p>gioielli italiani, italian jewelry, italian jewelry online, anelli donna, charms e bracciali.</p>
              </div>
              <div>
                <strong>Intento di ricerca</strong>
                <p>Acquisto diretto, gift ideas, premium collections e modern italian jewelry.</p>
              </div>
              <div>
                <strong>Contenuto bilingue SEO</strong>
                <p>Copy e metadata pensati per keyword italiane e inglesi con focus su Italian jewelry.</p>
              </div>
            </div>
            <div className={styles.seoLinks}>
              <a href="/italian-jewelry">Vai alla landing English SEO</a>
            </div>
          </section>
        </div>

        <aside id="cart" className={styles.cart}>
          <div className={styles.cartHeader}>
            <h2>Shopping bag</h2>
            <span>{cart.length} articoli</span>
          </div>

          <div className={styles.cartItems}>
            {cart.length === 0 ? (
              <p className={styles.empty}>Aggiungi i tuoi pezzi preferiti per iniziare il checkout.</p>
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
              <span>Email per l'ordine</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="cliente@accordi.com"
              />
            </label>
          <div className={styles.totalRow}>
            <span>Totale</span>
            <strong>€ {(total / 100).toFixed(2)}</strong>
          </div>
          {checkoutError ? <p className={styles.checkoutError}>{checkoutError}</p> : null}
          <button
            type="button"
            className={styles.checkoutButton}
              onClick={handleCheckout}
              disabled={cart.length === 0 || checkoutPending}
            >
              {checkoutPending ? "Reindirizzamento..." : "Vai al checkout"}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
