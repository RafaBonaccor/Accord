import Image from "next/image";
import Link from "next/link";

import { ProductPurchaseActions } from "./product-purchase-actions";
import { Locale } from "../lib/i18n";
import {
  categoryLabelForProduct,
  categoryPathForProduct,
  productPath,
} from "../lib/product-routes";
import { Product } from "../lib/types";
import styles from "./product-detail-page.module.css";

type Props = {
  locale: Locale;
  product: Product;
  relatedProducts: Product[];
};

type ProductReview = {
  quote: string;
  author: string;
  meta: string;
};

const copy = {
  it: {
    home: "Home",
    products: "Prodotti",
    category: "Categoria",
    material: "Materiale",
    detailsTitle: "Dettagli prodotto",
    detailsBody:
      "Finiture, materiali e dettagli pensati per accompagnare il prodotto con chiarezza.",
    reviewsTitle: "Recensioni",
    reviewsBody: "Feedback mock inseriti per dare piu credibilita e contesto alla scheda prodotto.",
    relatedTitle: "Potrebbe piacerti anche",
    relatedBody:
      "Altri pezzi selezionati per essere abbinati con naturalezza.",
    backToCategory: "Torna alla categoria",
    exploreCollection: "Scopri altri prodotti",
  },
  en: {
    home: "Home",
    products: "Products",
    category: "Category",
    material: "Material",
    detailsTitle: "Product details",
    detailsBody:
      "Finishes, materials and details designed to present the piece with clarity.",
    reviewsTitle: "Reviews",
    reviewsBody: "Mock feedback added to give the product page more context and trust.",
    relatedTitle: "You may also like",
    relatedBody:
      "More selected pieces designed to pair naturally with this style.",
    backToCategory: "Back to category",
    exploreCollection: "Explore more products",
  },
} as const;

function productReviews(locale: Locale, product: Product): ProductReview[] {
  const categoryLabel = categoryLabelForProduct(locale, product);
  if (locale === "it") {
    return [
      {
        quote: `Dal vivo questo ${categoryLabel.toLowerCase()} risulta ancora piu luminoso e rifinito di quanto immaginassi.`,
        author: "Giulia R.",
        meta: "Acquisto verificato · Agosto 2026",
      },
      {
        quote: "Confezione molto curata e vestibilita immediata. Ha un effetto elegante ma resta facile da portare ogni giorno.",
        author: "Martina L.",
        meta: "Cliente abituale · Luglio 2026",
      },
      {
        quote: `L'ho scelto come regalo e ha trasmesso subito una sensazione premium, soprattutto nei dettagli e nella finitura ${product.material.toLowerCase()}.`,
        author: "Sofia C.",
        meta: "Gift order · Giugno 2026",
      },
    ];
  }

  return [
    {
      quote: `This ${categoryLabel.toLowerCase()} feels even more polished in person and the finish looks genuinely refined.`,
      author: "Olivia M.",
      meta: "Verified purchase · August 2026",
    },
    {
      quote: "Beautiful presentation, easy to wear and elegant without feeling too formal for everyday styling.",
      author: "Emma T.",
      meta: "Returning customer · July 2026",
    },
    {
      quote: `I bought it as a gift and it immediately felt premium, especially in the ${product.material.toLowerCase()} details.`,
      author: "Chloe S.",
      meta: "Gift order · June 2026",
    },
  ];
}

export function ProductDetailPage({ locale, product, relatedProducts }: Props) {
  const labels = copy[locale];
  const categoryPath = categoryPathForProduct(locale, product);
  const categoryLabel = categoryLabelForProduct(locale, product);
  const homePath = locale === "en" ? "/en" : "/";
  const reviews = productReviews(locale, product);
  const galleryImages = product.images?.length
    ? product.images
    : [{ id: null, image_url: product.image_url, position: 0, is_primary: true }];

  return (
    <main className={styles.page}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <Link href={homePath}>{labels.home}</Link>
        <span>/</span>
        {categoryPath ? <Link href={categoryPath}>{categoryLabel}</Link> : <span>{labels.products}</span>}
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <section className={styles.hero}>
        <div className={styles.gallery}>
          <div className={styles.imagePanel}>
            <Image
              src={galleryImages[0].image_url}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 980px) 100vw, 55vw"
              className={styles.image}
            />
          </div>

          {galleryImages.length > 1 ? (
            <div className={styles.thumbnailGrid} aria-label="Product images">
              {galleryImages.slice(1).map((image, index) => (
                <div key={`${image.image_url}-${index}`} className={styles.thumbnail}>
                  <Image
                    src={image.image_url}
                    alt={`${product.name} detail ${index + 2}`}
                    fill
                    sizes="(max-width: 980px) 33vw, 14vw"
                    className={styles.image}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.copy}>
          <p className={styles.eyebrow}>{categoryLabel}</p>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.price}>€ {(product.price_cents / 100).toFixed(2)}</p>
          <p className={styles.description}>{product.description}</p>
          <ProductPurchaseActions locale={locale} product={product} />

          <div className={styles.metaGrid}>
            <div className={styles.metaCard}>
              <span>{labels.category}</span>
              <strong>{categoryLabel}</strong>
            </div>
            <div className={styles.metaCard}>
              <span>{labels.material}</span>
              <strong>{product.material}</strong>
            </div>
          </div>

          <div className={styles.actions}>
            {categoryPath ? (
              <Link href={categoryPath} className={styles.primaryAction}>
                {labels.backToCategory}
              </Link>
            ) : null}
            <Link href={homePath} className={styles.secondaryAction}>
              {labels.exploreCollection}
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>{labels.detailsTitle}</h2>
          <p>{labels.detailsBody}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>{labels.reviewsTitle}</h2>
          <p>{labels.reviewsBody}</p>
        </div>
        <div className={styles.reviewsGrid}>
          {reviews.map((review) => (
            <article key={`${review.author}-${review.meta}`} className={styles.reviewCard}>
              <p className={styles.reviewQuote}>&ldquo;{review.quote}&rdquo;</p>
              <div className={styles.reviewFooter}>
                <strong>{review.author}</strong>
                <span>{review.meta}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {relatedProducts.length ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>{labels.relatedTitle}</h2>
            <p>{labels.relatedBody}</p>
          </div>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((item) => (
              <Link key={item.id} href={productPath(locale, item.slug)} className={styles.relatedCard}>
                <div className={styles.relatedImageWrap}>
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    sizes="(max-width: 980px) 100vw, 33vw"
                    className={styles.image}
                  />
                </div>
                <div className={styles.relatedBody}>
                  <p className={styles.relatedMeta}>
                    {categoryLabelForProduct(locale, item)} · {item.material}
                  </p>
                  <h3>{item.name}</h3>
                  <p className={styles.relatedPrice}>€ {(item.price_cents / 100).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
