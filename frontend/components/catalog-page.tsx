import Image from "next/image";
import Link from "next/link";

import { Locale } from "../lib/i18n";
import { productPath } from "../lib/product-routes";
import { Product } from "../lib/types";
import styles from "./catalog-page.module.css";

type StoryBlock = {
  title: string;
  body: string;
};

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  panelTitle: string;
  panelBody: string;
  bullets: string[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  sectionTitle: string;
  sectionBody: string;
  products: Product[];
  locale: Locale;
  currentPage?: number;
  totalPages?: number;
  pageHref?: (page: number) => string;
  storyTitle?: string;
  storyBlocks?: StoryBlock[];
};

export function CatalogPage(props: Props) {
  const {
    eyebrow,
    title,
    intro,
    panelTitle,
    panelBody,
    bullets,
    primaryHref,
    primaryLabel,
    secondaryHref,
    secondaryLabel,
    sectionTitle,
    sectionBody,
    products,
    locale,
    currentPage = 1,
    totalPages = 1,
    pageHref,
    storyTitle,
    storyBlocks,
  } = props;

  const pageCopy = locale === "it" ? "Pagina" : "Page";
  const prevCopy = locale === "it" ? "Precedente" : "Previous";
  const nextCopy = locale === "it" ? "Successiva" : "Next";

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
          <div className={styles.actions}>
            <Link href={primaryHref} className={styles.primaryAction}>
              {primaryLabel}
            </Link>
            <Link href={secondaryHref} className={styles.secondaryAction}>
              {secondaryLabel}
            </Link>
          </div>
        </div>
        <div className={styles.heroPanel}>
          <p className={styles.eyebrow}>Accordi Edit</p>
          <h2>{panelTitle}</h2>
          <p>{panelBody}</p>
          <ul className={styles.heroList}>
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.sectionHeader}>
          <h2>{sectionTitle}</h2>
          <p>{sectionBody}</p>
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
                    className={styles.image}
                  />
                </Link>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.meta}>
                  {product.category} · {product.material}
                </p>
                <h3>
                  <Link href={productPath(locale, product.slug)}>{product.name}</Link>
                </h3>
                <p>{product.description}</p>
                <p className={styles.price}>€ {(product.price_cents / 100).toFixed(2)}</p>
              </div>
            </article>
          ))}
        </div>
        {pageHref && totalPages > 1 ? (
          <nav className={styles.pagination} aria-label={`${sectionTitle} pagination`}>
            {currentPage > 1 ? (
              <Link href={pageHref(currentPage - 1)} className={styles.paginationLink}>
                {prevCopy}
              </Link>
            ) : (
              <span className={styles.paginationLinkDisabled}>{prevCopy}</span>
            )}
            <div className={styles.paginationPages}>
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                const active = page === currentPage;
                return active ? (
                  <span key={page} className={styles.paginationLinkActive}>
                    {pageCopy} {page}
                  </span>
                ) : (
                  <Link key={page} href={pageHref(page)} className={styles.paginationLink}>
                    {pageCopy} {page}
                  </Link>
                );
              })}
            </div>
            {currentPage < totalPages ? (
              <Link href={pageHref(currentPage + 1)} className={styles.paginationLink}>
                {nextCopy}
              </Link>
            ) : (
              <span className={styles.paginationLinkDisabled}>{nextCopy}</span>
            )}
          </nav>
        ) : null}
      </section>

      {storyTitle && storyBlocks?.length ? (
        <section className={styles.storySection}>
          <h2>{storyTitle}</h2>
          <div className={styles.storyGrid}>
            {storyBlocks.map((block) => (
              <article key={block.title} className={styles.storyCard}>
                <h3>{block.title}</h3>
                <p>{block.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
