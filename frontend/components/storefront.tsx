"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "../hooks/use-cart";
import { ShoppingBag } from "./shopping-bag";
import { storefrontCopy } from "../lib/copy";
import { Locale } from "../lib/i18n";
import { productPath } from "../lib/product-routes";
import { routeFor } from "../lib/routes";
import { Product } from "../lib/types";
import styles from "./storefront.module.css";

type Props = {
  products: Product[];
  locale: Locale;
};

export function Storefront({ products, locale }: Props) {
  const { addToCart } = useCart();
  const featuredProducts = products.filter((product) => product.featured);
  const latestProducts = products.slice(0, 4);
  const copy = storefrontCopy[locale];
  const englishSeoPath = "/italian-jewelry";
  const categoryLinks = {
    new: routeFor(locale, "new"),
    charms: routeFor(locale, "charms"),
    bracelets: routeFor(locale, "bracelets"),
    rings: routeFor(locale, "rings"),
    earrings: routeFor(locale, "earrings"),
    necklaces: routeFor(locale, "necklaces"),
  };

  return (
    <main className={styles.page} lang={locale}>
      <section className={styles.utilityStrip}>
        {copy.serviceHighlights.map((item) => (
          <div key={item} className={styles.utilityItem}>
            {item}
          </div>
        ))}
      </section>

      <section className={styles.categoryStrip}>
        {copy.categoryPills.map((pill, index) => {
          const href =
            index === 0
              ? categoryLinks.new
              : index === 1
                ? categoryLinks.charms
                : index === 2
                  ? categoryLinks.bracelets
                    : index === 3
                      ? categoryLinks.rings
                      : index === 4
                        ? categoryLinks.earrings
                        : index === 5
                          ? categoryLinks.necklaces
                    : "#shop";
          return (
            <a key={pill} href={href} className={styles.categoryPill}>
            {pill}
            </a>
          );
        })}
      </section>

      <div className={styles.contentLayout}>
        <div className={styles.catalogColumn}>
          <section className={styles.arrivalsSection}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>{copy.arrivalsEyebrow}</p>
                <h2>{copy.arrivalsTitle}</h2>
              </div>
              <p>{copy.arrivalsBody}</p>
            </div>
            <div className={styles.grid}>
              {latestProducts.map((product) => (
                <article key={product.id} className={styles.card}>
                  <div className={styles.imageWrap}>
                    <Link href={productPath(locale, product.slug)} aria-label={product.name}>
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className={styles.productImage}
                      />
                    </Link>
                  </div>
                  <div className={styles.cardBody}>
                    <div>
                      <p className={styles.meta}>
                        {product.category} · {product.material}
                      </p>
                      <h3>
                        <Link href={productPath(locale, product.slug)}>{product.name}</Link>
                      </h3>
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

          <section id="campaign" className={styles.featureSection}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>{copy.featuredEyebrow}</p>
                <h2>{copy.featuredTitle}</h2>
              </div>
              <p>{copy.featuredBody}</p>
            </div>
            <div className={styles.featureRow}>
              {featuredProducts.map((product) => (
                <article key={product.id} className={styles.featureCard}>
                  <div className={styles.featureImageWrap}>
                    <Link href={productPath(locale, product.slug)} aria-label={product.name}>
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={styles.productImage}
                      />
                    </Link>
                  </div>
                  <div className={styles.featureCardBody}>
                    <p className={styles.meta}>
                      {product.category} · {product.material}
                    </p>
                    <h2>
                      <Link href={productPath(locale, product.slug)}>{product.name}</Link>
                    </h2>
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
            </div>
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
                    <Link href={productPath(locale, product.slug)} aria-label={product.name}>
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className={styles.productImage}
                      />
                    </Link>
                  </div>
                  <div className={styles.cardBody}>
                    <div>
                      <p className={styles.meta}>
                        {product.category} · {product.material}
                      </p>
                      <h3>
                        <Link href={productPath(locale, product.slug)}>{product.name}</Link>
                      </h3>
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

        <ShoppingBag locale={locale} continueHref={locale === "en" ? "/en#shop" : "/#shop"} />
      </div>
    </main>
  );
}
