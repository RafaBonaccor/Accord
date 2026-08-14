"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  ApiRequestError,
  createAdminCollection,
  createAdminProduct,
  deleteAdminCollection,
  deleteAdminProduct,
  getAdminCollections,
  getAdminProducts,
  importAdminProducts,
  updateAdminCollection,
  updateAdminProduct,
} from "../lib/api";
import { Collection, CollectionInput, Product, ProductInput } from "../lib/types";
import styles from "./admin-dashboard.module.css";

type AdminSection = "overview" | "products" | "collections" | "import";

const sectionCopy: Array<{ id: AdminSection; label: string; body: string }> = [
  { id: "overview", label: "Overview", body: "KPI rapidi, stato catalogo e accesso alle azioni principali." },
  { id: "products", label: "Products", body: "Schede prodotto, assegnazione collezione e pubblicazione." },
  { id: "collections", label: "Collections", body: "Crea collezioni dedicate e abbinale ai prodotti dal menu a libretto." },
  { id: "import", label: "Import", body: "Caricamento massivo da JSON per collezioni capsule o stagionali." },
];

const emptyProduct: ProductInput = {
  name: "",
  slug: "",
  description: "",
  price_cents: 0,
  image_url: "",
  category: "",
  material: "",
  collection_id: null,
  featured: false,
};

const emptyCollection: CollectionInput = {
  name: "",
  slug: "",
  description: "",
};

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [form, setForm] = useState<ProductInput>(emptyProduct);
  const [collectionForm, setCollectionForm] = useState<CollectionInput>(emptyCollection);
  const [jsonInput, setJsonInput] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const featuredCount = products.filter((product) => product.featured).length;
  const categoriesCount = new Set(products.map((product) => product.category)).size;
  const uncategorizedCollectionCount = products.filter((product) => product.collection_id == null).length;

  const selectedSection = sectionCopy.find((section) => section.id === activeSection) ?? sectionCopy[0];

  const collectionOptions = useMemo(
    () =>
      collections.map((collection) => ({
        value: collection.id,
        label: collection.name,
      })),
    [collections],
  );

  function explainAdminError(error: unknown): string {
    if (error instanceof ApiRequestError) {
      if (error.status === 401) {
        return "Sessione admin non valida o scaduta. Effettua di nuovo il login.";
      }
      if (error.status === 404) {
        return `Elemento non trovato. Dettaglio: ${error.detail ?? "verifica prodotto o collezione selezionata."}`;
      }
      if (error.status === 409) {
        return `Conflitto dati: ${error.detail ?? "slug gia presente o contenuto duplicato."}`;
      }
      if (error.status === 422) {
        return "Dati non validi. Controlla nome, slug, descrizione, prezzo, immagine, categoria, materiale e collezione.";
      }
      if (error.status === 503) {
        return `Servizio non configurato o temporaneamente non disponibile. Dettaglio: ${error.detail ?? "verifica backend, database o variabili ambiente."}`;
      }
      if (error.status >= 500) {
        return `Errore server admin. Dettaglio: ${error.detail ?? "il backend non e riuscito a completare la richiesta."}`;
      }
      if (error.status === 0) {
        return `Servizio admin non raggiungibile. Dettaglio tecnico: ${error.detail ?? "errore di rete interno."}`;
      }
      return error.detail ?? error.message;
    }

    if (error instanceof SyntaxError) {
      return "JSON non valido. Correggi il formato prima di importare prodotti o collezioni.";
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Errore sconosciuto nella richiesta admin.";
  }

  function showAdminError(error: unknown) {
    const message = explainAdminError(error);
    setError(message);
    setPopupMessage(message);
  }

  async function loadCatalog() {
    setLoading(true);
    setError(null);
    try {
      const [loadedProducts, loadedCollections] = await Promise.all([getAdminProducts(), getAdminCollections()]);
      setProducts(loadedProducts);
      setCollections(loadedCollections);
      setStatus(`Catalogo sincronizzato: ${loadedProducts.length} prodotti, ${loadedCollections.length} collezioni.`);
    } catch (loadError) {
      showAdminError(loadError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCatalog();
  }, []);

  function resetProductForm() {
    setForm(emptyProduct);
    setSelectedProductId(null);
  }

  function resetCollectionForm() {
    setCollectionForm(emptyCollection);
    setSelectedCollectionId(null);
  }

  function fillForm(product: Product) {
    setActiveSection("products");
    setSelectedProductId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price_cents: product.price_cents,
      image_url: product.image_url,
      category: product.category,
      material: product.material,
      collection_id: product.collection_id,
      featured: product.featured,
    });
  }

  function fillCollectionForm(collection: Collection) {
    setActiveSection("collections");
    setSelectedCollectionId(collection.id);
    setCollectionForm({
      name: collection.name,
      slug: collection.slug,
      description: collection.description ?? "",
    });
  }

  async function handleSaveProduct() {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      if (selectedProductId) {
        await updateAdminProduct(selectedProductId, form);
        setStatus(`Prodotto #${selectedProductId} aggiornato`);
      } else {
        const created = await createAdminProduct(form);
        setStatus(`Prodotto creato: #${created.id}`);
      }
      resetProductForm();
      await loadCatalog();
    } catch (saveError) {
      showAdminError(saveError);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(productId: number) {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      await deleteAdminProduct(productId);
      setStatus(`Prodotto eliminato: #${productId}`);
      if (selectedProductId === productId) {
        resetProductForm();
      }
      await loadCatalog();
    } catch (deleteError) {
      showAdminError(deleteError);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveCollection() {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      if (selectedCollectionId) {
        await updateAdminCollection(selectedCollectionId, collectionForm);
        setStatus(`Collezione #${selectedCollectionId} aggiornata`);
      } else {
        const created = await createAdminCollection(collectionForm);
        setStatus(`Collezione creata: #${created.id}`);
      }
      resetCollectionForm();
      await loadCatalog();
    } catch (saveError) {
      showAdminError(saveError);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCollection(collectionId: number) {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      await deleteAdminCollection(collectionId);
      setStatus(`Collezione eliminata: #${collectionId}`);
      if (selectedCollectionId === collectionId) {
        resetCollectionForm();
      }
      await loadCatalog();
    } catch (deleteError) {
      showAdminError(deleteError);
    } finally {
      setLoading(false);
    }
  }

  async function handleImportJson() {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const parsed = JSON.parse(jsonInput) as ProductInput[] | { items: ProductInput[] };
      const items = Array.isArray(parsed) ? parsed : parsed.items;
      const response = await importAdminProducts(items);
      setStatus(`Import completato: ${response.imported_count} prodotti`);
      setJsonInput("");
      await loadCatalog();
    } catch (importError) {
      showAdminError(importError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      {popupMessage ? (
        <div className={styles.errorModalBackdrop} role="presentation" onClick={() => setPopupMessage(null)}>
          <div
            className={styles.errorModal}
            role="alertdialog"
            aria-labelledby="admin-error-title"
            aria-describedby="admin-error-body"
            onClick={(event) => event.stopPropagation()}
          >
            <p className={styles.eyebrow}>Errore admin</p>
            <h2 id="admin-error-title" className={styles.sectionTitle}>
              Richiesta non completata
            </h2>
            <p id="admin-error-body" className={styles.errorModalCopy}>
              {popupMessage}
            </p>
            <div className={styles.actions}>
              <button type="button" className={styles.primaryButton} onClick={() => setPopupMessage(null)}>
                Chiudi
              </button>
              <Link href="/admin/login" className={styles.secondaryButton}>
                Vai al login
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <div className={styles.bookletShell}>
        <aside className={styles.bookletMenu}>
          <div className={styles.bookletHeader}>
            <p className={styles.eyebrow}>Admin dashboard</p>
            <h1>Catalogo & Collezioni</h1>
            <p className={styles.bookletIntro}>
              Menu a libretto per gestire prodotti, collezioni capsule e import massivi senza
              esporre il token admin nel browser.
            </p>
          </div>

          <nav className={styles.bookletNav} aria-label="Admin sections">
            {sectionCopy.map((section, index) => (
              <button
                key={section.id}
                type="button"
                className={section.id === activeSection ? styles.bookletTabActive : styles.bookletTab}
                onClick={() => setActiveSection(section.id)}
              >
                <span className={styles.bookletTabIndex}>{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <strong>{section.label}</strong>
                  <small>{section.body}</small>
                </span>
              </button>
            ))}
          </nav>

          <div className={styles.bookletActions}>
            <button type="button" className={styles.primaryButton} onClick={() => loadCatalog()} disabled={loading}>
              Aggiorna catalogo
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                resetProductForm();
                setActiveSection("products");
              }}
              disabled={loading}
            >
              Nuovo prodotto
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                resetCollectionForm();
                setActiveSection("collections");
              }}
              disabled={loading}
            >
              Nuova collection
            </button>
            <Link href="/admin/logout" className={styles.secondaryButton}>
              Logout
            </Link>
          </div>

          {status ? <p className={styles.statusOk}>{status}</p> : null}
          {error ? <p className={styles.statusError}>{error}</p> : null}
        </aside>

        <section className={styles.bookletContent}>
          <header className={styles.heroCard}>
            <div>
              <p className={styles.eyebrow}>Sezione attiva</p>
              <h2>{selectedSection.label}</h2>
            </div>
            <p>{selectedSection.body}</p>
          </header>

          <div className={styles.stats}>
            <article className={styles.statsCard}>
              <p className={styles.eyebrow}>Prodotti</p>
              <strong>{products.length}</strong>
            </article>
            <article className={styles.statsCard}>
              <p className={styles.eyebrow}>Collection</p>
              <strong>{collections.length}</strong>
            </article>
            <article className={styles.statsCard}>
              <p className={styles.eyebrow}>Featured</p>
              <strong>{featuredCount}</strong>
            </article>
            <article className={styles.statsCard}>
              <p className={styles.eyebrow}>Categorie</p>
              <strong>{categoriesCount}</strong>
            </article>
            <article className={styles.statsCard}>
              <p className={styles.eyebrow}>Senza collection</p>
              <strong>{uncategorizedCollectionCount}</strong>
            </article>
          </div>

          {activeSection === "overview" ? (
            <div className={styles.overviewGrid}>
              <article className={styles.infoCard}>
                <p className={styles.eyebrow}>Workflow</p>
                <h3>Pubblica per collezioni</h3>
                <p>
                  Crea prima una collection, poi assegna i prodotti dal form prodotto usando il
                  selettore dedicato.
                </p>
              </article>
              <article className={styles.infoCard}>
                <p className={styles.eyebrow}>Stato catalogo</p>
                <h3>Archivio strutturato</h3>
                <p>
                  I prodotti mantengono categoria, materiale e ora anche la collection per creare
                  capsule o drop stagionali.
                </p>
              </article>
              <article className={styles.infoCard}>
                <p className={styles.eyebrow}>Accesso</p>
                <h3>Admin protetto</h3>
                <p>
                  Login server-side, cookie `httpOnly` e proxy interno rendono l&apos;area piu
                  solida rispetto al token esposto nel browser.
                </p>
              </article>
            </div>
          ) : null}

          {activeSection === "products" ? (
            <div className={styles.sectionGrid}>
              <article className={styles.editorCard}>
                <p className={styles.eyebrow}>Product editor</p>
                <h3>{selectedProductId ? "Modifica prodotto" : "Crea prodotto"}</h3>
                <div className={styles.formGrid}>
                  <label className={styles.field}>
                    <span>Nome</span>
                    <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                  </label>
                  <label className={styles.field}>
                    <span>Slug</span>
                    <input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
                  </label>
                  <label className={styles.fieldWide}>
                    <span>Descrizione</span>
                    <textarea
                      value={form.description}
                      onChange={(event) => setForm({ ...form, description: event.target.value })}
                    />
                  </label>
                  <label className={styles.field}>
                    <span>Prezzo in centesimi</span>
                    <input
                      type="number"
                      value={form.price_cents}
                      onChange={(event) => setForm({ ...form, price_cents: Number(event.target.value) })}
                    />
                  </label>
                  <label className={styles.fieldWide}>
                    <span>Image URL</span>
                    <input
                      value={form.image_url}
                      onChange={(event) => setForm({ ...form, image_url: event.target.value })}
                    />
                  </label>
                  <label className={styles.field}>
                    <span>Categoria</span>
                    <input
                      value={form.category}
                      onChange={(event) => setForm({ ...form, category: event.target.value })}
                    />
                  </label>
                  <label className={styles.field}>
                    <span>Materiale</span>
                    <input
                      value={form.material}
                      onChange={(event) => setForm({ ...form, material: event.target.value })}
                    />
                  </label>
                  <label className={styles.field}>
                    <span>Collection</span>
                    <select
                      value={form.collection_id ?? ""}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          collection_id: event.target.value ? Number(event.target.value) : null,
                        })
                      }
                    >
                      <option value="">Nessuna collection</option>
                      {collectionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                    />
                    <span>Featured</span>
                  </label>
                </div>
                <div className={styles.actions}>
                  <button type="button" className={styles.primaryButton} onClick={handleSaveProduct} disabled={loading}>
                    {selectedProductId ? "Salva modifiche" : "Crea prodotto"}
                  </button>
                  <button type="button" className={styles.secondaryButton} onClick={resetProductForm} disabled={loading}>
                    Reset
                  </button>
                </div>
              </article>

              <article className={styles.tableWrap}>
                <p className={styles.eyebrow}>Catalogo</p>
                <h3>Prodotti pubblicati</h3>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Prodotto</th>
                      <th>Collection</th>
                      <th>Categoria</th>
                      <th>Prezzo</th>
                      <th>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <strong>{product.name}</strong>
                          <br />
                          <span>{product.slug}</span>
                        </td>
                        <td>{product.collection_name ?? "Nessuna"}</td>
                        <td>
                          {product.category}
                          <br />
                          <span>{product.material}</span>
                        </td>
                        <td>€ {(product.price_cents / 100).toFixed(2)}</td>
                        <td>
                          <div className={styles.inlineActions}>
                            <button type="button" className={styles.secondaryButton} onClick={() => fillForm(product)}>
                              Modifica
                            </button>
                            <button
                              type="button"
                              className={styles.dangerButton}
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={loading}
                            >
                              Elimina
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            </div>
          ) : null}

          {activeSection === "collections" ? (
            <div className={styles.sectionGrid}>
              <article className={styles.editorCard}>
                <p className={styles.eyebrow}>Collection editor</p>
                <h3>{selectedCollectionId ? "Modifica collection" : "Crea collection"}</h3>
                <div className={styles.formGrid}>
                  <label className={styles.field}>
                    <span>Nome</span>
                    <input
                      value={collectionForm.name}
                      onChange={(event) => setCollectionForm({ ...collectionForm, name: event.target.value })}
                    />
                  </label>
                  <label className={styles.field}>
                    <span>Slug</span>
                    <input
                      value={collectionForm.slug}
                      onChange={(event) => setCollectionForm({ ...collectionForm, slug: event.target.value })}
                    />
                  </label>
                  <label className={styles.fieldWide}>
                    <span>Descrizione</span>
                    <textarea
                      value={collectionForm.description}
                      onChange={(event) => setCollectionForm({ ...collectionForm, description: event.target.value })}
                    />
                  </label>
                </div>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={handleSaveCollection}
                    disabled={loading}
                  >
                    {selectedCollectionId ? "Salva collection" : "Crea collection"}
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={resetCollectionForm}
                    disabled={loading}
                  >
                    Reset
                  </button>
                </div>
              </article>

              <article className={styles.tableWrap}>
                <p className={styles.eyebrow}>Collections</p>
                <h3>Menu a libretto</h3>
                <div className={styles.collectionList}>
                  {collections.map((collection) => {
                    const count = products.filter((product) => product.collection_id === collection.id).length;
                    return (
                      <button
                        key={collection.id}
                        type="button"
                        className={styles.collectionCard}
                        onClick={() => fillCollectionForm(collection)}
                      >
                        <span>
                          <strong>{collection.name}</strong>
                          <small>{collection.slug}</small>
                        </span>
                        <span className={styles.collectionMeta}>{count} prodotti</span>
                      </button>
                    );
                  })}
                </div>
                {selectedCollectionId ? (
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.dangerButton}
                      onClick={() => handleDeleteCollection(selectedCollectionId)}
                      disabled={loading}
                    >
                      Elimina collection
                    </button>
                  </div>
                ) : null}
              </article>
            </div>
          ) : null}

          {activeSection === "import" ? (
            <article className={styles.editorCard}>
              <p className={styles.eyebrow}>Import JSON</p>
              <h3>Caricamento massivo prodotti</h3>
              <p className={styles.helper}>
                Usa `collection_id` per assegnare subito i prodotti a una collection esistente.
              </p>
              <label className={styles.fieldWide}>
                <span>Payload JSON</span>
                <textarea value={jsonInput} onChange={(event) => setJsonInput(event.target.value)} />
              </label>
              <div className={styles.actions}>
                <button type="button" className={styles.primaryButton} onClick={handleImportJson} disabled={loading}>
                  Importa prodotti
                </button>
              </div>
              <pre className={styles.jsonBlock}>{`[
  {
    "name": "Moonlight Necklace",
    "slug": "moonlight-necklace",
    "description": "Collana con finish satinato e charm centrale.",
    "price_cents": 14900,
    "image_url": "https://example.com/necklace.jpg",
    "category": "Necklaces",
    "material": "Gold Plated",
    "collection_id": 1,
    "featured": true
  }
]`}</pre>
            </article>
          ) : null}
        </section>
      </div>
    </main>
  );
}
