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

const copy = {
  it: {
    home: "Home",
    products: "Prodotti",
    category: "Categoria",
    material: "Materiale",
    detailsTitle: "Dettagli prodotto",
    detailsBody:
      "Finiture, materiali e dettagli pensati per accompagnare il prodotto con chiarezza.",
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
    relatedTitle: "You may also like",
    relatedBody:
      "More selected pieces designed to pair naturally with this style.",
    backToCategory: "Back to category",
    exploreCollection: "Explore more products",
  },
} as const;

export function ProductDetailPage({ locale, product, relatedProducts }: Props) {
  const labels = copy[locale];
  const categoryPath = categoryPathForProduct(locale, product);
  const categoryLabel = categoryLabelForProduct(locale, product);
  const homePath = locale === "en" ? "/en" : "/";

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
        <div className={styles.imagePanel}>
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 980px) 100vw, 55vw"
            className={styles.image}
          />
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
