"use client";

import { useEffect, useState } from "react";

import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  importAdminProducts,
  updateAdminProduct,
} from "../lib/api";
import { Product, ProductInput } from "../lib/types";
import styles from "./admin-dashboard.module.css";

const ADMIN_TOKEN_STORAGE_KEY = "accordi-admin-token";

const emptyProduct: ProductInput = {
  name: "",
  slug: "",
  description: "",
  price_cents: 0,
  image_url: "",
  category: "",
  material: "",
  featured: false,
};

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductInput>(emptyProduct);
  const [jsonInput, setJsonInput] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    if (saved) {
      setToken(saved);
    }
  }, []);

  async function loadProducts(nextToken = token) {
    if (!nextToken) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const items = await getAdminProducts(nextToken);
      setProducts(items);
      setStatus(`Prodotti caricati: ${items.length}`);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load admin products");
    } finally {
      setLoading(false);
    }
  }

  function persistToken(nextToken: string) {
    setToken(nextToken);
    window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, nextToken);
  }

  function resetForm() {
    setForm(emptyProduct);
    setSelectedProductId(null);
  }

  function fillForm(product: Product) {
    setSelectedProductId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price_cents: product.price_cents,
      image_url: product.image_url,
      category: product.category,
      material: product.material,
      featured: product.featured,
    });
  }

  async function handleSaveProduct() {
    if (!token) {
      setError("Inserisci prima il token admin");
      return;
    }
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      if (selectedProductId) {
        await updateAdminProduct(token, selectedProductId, form);
        setStatus(`Prodotto #${selectedProductId} aggiornato`);
      } else {
        const created = await createAdminProduct(token, form);
        setStatus(`Prodotto creato: #${created.id}`);
      }
      resetForm();
      await loadProducts(token);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save product");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(productId: number) {
    if (!token) {
      setError("Inserisci prima il token admin");
      return;
    }
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      await deleteAdminProduct(token, productId);
      setStatus(`Prodotto eliminato: #${productId}`);
      if (selectedProductId === productId) {
        resetForm();
      }
      await loadProducts(token);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete product");
    } finally {
      setLoading(false);
    }
  }

  async function handleImportJson() {
    if (!token) {
      setError("Inserisci prima il token admin");
      return;
    }
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const parsed = JSON.parse(jsonInput) as ProductInput[] | { items: ProductInput[] };
      const items = Array.isArray(parsed) ? parsed : parsed.items;
      const response = await importAdminProducts(token, items);
      setStatus(`Import completato: ${response.imported_count} prodotti`);
      setJsonInput("");
      await loadProducts(token);
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Invalid JSON import");
    } finally {
      setLoading(false);
    }
  }

  const featuredCount = products.filter((product) => product.featured).length;
  const categoriesCount = new Set(products.map((product) => product.category)).size;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.panel}>
          <p className={styles.eyebrow}>Admin dashboard</p>
          <h1>Gestione catalogo</h1>
          <p>
            Dashboard per caricare prodotti manualmente o via JSON. Le API admin accettano
            richieste solo con token `Bearer`.
          </p>

          <div className={styles.stack}>
            <label className={styles.field}>
              <span>Admin token</span>
              <input
                type="password"
                value={token}
                onChange={(event) => persistToken(event.target.value)}
                placeholder="change-me-admin-token"
              />
            </label>
            <div className={styles.actions}>
              <button type="button" className={styles.primaryButton} onClick={() => loadProducts()} disabled={loading}>
                Carica prodotti
              </button>
              <button type="button" className={styles.secondaryButton} onClick={resetForm} disabled={loading}>
                Nuovo prodotto
              </button>
            </div>
            {status ? <p className={styles.statusOk}>{status}</p> : null}
            {error ? <p className={styles.statusError}>{error}</p> : null}
          </div>

          <div className={styles.stack}>
            <h2 className={styles.sectionTitle}>{selectedProductId ? "Modifica prodotto" : "Crea prodotto"}</h2>
            <label className={styles.field}>
              <span>Nome</span>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label className={styles.field}>
              <span>Slug</span>
              <input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
            </label>
            <label className={styles.field}>
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
            <label className={styles.field}>
              <span>Image URL</span>
              <input
                value={form.image_url}
                onChange={(event) => setForm({ ...form, image_url: event.target.value })}
              />
            </label>
            <label className={styles.field}>
              <span>Categoria</span>
              <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
            </label>
            <label className={styles.field}>
              <span>Materiale</span>
              <input value={form.material} onChange={(event) => setForm({ ...form, material: event.target.value })} />
            </label>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm({ ...form, featured: event.target.checked })}
              />
              <span>Featured</span>
            </label>
            <div className={styles.actions}>
              <button type="button" className={styles.primaryButton} onClick={handleSaveProduct} disabled={loading}>
                {selectedProductId ? "Salva modifiche" : "Crea prodotto"}
              </button>
            </div>
          </div>

          <div className={styles.stack}>
            <h2 className={styles.sectionTitle}>Import JSON</h2>
            <p className={styles.helper}>
              Accetta un array JSON oppure un oggetto con chiave <code>items</code> e campi
              prodotto completi.
            </p>
            <label className={styles.field}>
              <span>Payload JSON</span>
              <textarea value={jsonInput} onChange={(event) => setJsonInput(event.target.value)} />
            </label>
            <button type="button" className={styles.primaryButton} onClick={handleImportJson} disabled={loading}>
              Importa prodotti
            </button>
          </div>
        </aside>

        <section className={styles.content}>
          <div className={styles.stats}>
            <article className={styles.statsCard}>
              <p className={styles.eyebrow}>Prodotti</p>
              <strong>{products.length}</strong>
            </article>
            <article className={styles.statsCard}>
              <p className={styles.eyebrow}>Featured</p>
              <strong>{featuredCount}</strong>
            </article>
            <article className={styles.statsCard}>
              <p className={styles.eyebrow}>Categorie</p>
              <strong>{categoriesCount}</strong>
            </article>
          </div>

          <article className={styles.tableWrap}>
            <h2 className={styles.sectionTitle}>Catalogo prodotti</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Prodotto</th>
                  <th>Categoria</th>
                  <th>Prezzo</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <strong>{product.name}</strong>
                      <br />
                      <span>{product.slug}</span>
                    </td>
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

          <article className={styles.docsCard}>
            <p className={styles.eyebrow}>API admin</p>
            <h2>Endpoint da interrogare</h2>
            <p>Header richiesto per tutte le chiamate admin: `Authorization: Bearer &lt;ADMIN_API_TOKEN&gt;`</p>
            <pre className={styles.jsonBlock}>{`GET    /api/admin/products
POST   /api/admin/products
PATCH  /api/admin/products/{product_id}
DELETE /api/admin/products/{product_id}
POST   /api/admin/products/import-json

JSON import example:
[
  {
    "name": "Moonlight Necklace",
    "slug": "moonlight-necklace",
    "description": "Collana con finish satinato e charm centrale.",
    "price_cents": 14900,
    "image_url": "https://example.com/necklace.jpg",
    "category": "Necklaces",
    "material": "Gold Plated",
    "featured": true
  }
]`}</pre>
          </article>
        </section>
      </div>
    </main>
  );
}
