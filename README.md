# Accordi Jewelry

Base e-commerce per gioielli con frontend Next.js e backend FastAPI, catalogo prodotti, carrello e checkout Stripe.

## Struttura

- `frontend`: storefront Next.js 14 con App Router
- `backend`: API FastAPI con Stripe Checkout e supporto Postgres/Supabase

## Avvio con Docker

```bash
docker compose up --build
```

Servizi esposti:

- `http://localhost:3000` frontend
- `http://localhost:8000` backend

## Avvio locale

### Backend

1. Crea un virtualenv Python.
2. Installa le dipendenze:

```bash
pip install -r backend/requirements.txt
```

3. Configura le variabili ambiente:

```bash
cp backend/.env.example backend/.env
```

4. Se usi Supabase, importa prima lo schema SQL:

```sql
-- esegui backend/supabase_schema.sql nel SQL Editor di Supabase
```

5. Avvia l'API:

```bash
uvicorn app.main:app --reload --app-dir backend
```

### Frontend

1. Installa le dipendenze:

```bash
cd frontend
npm install
```

2. Configura le variabili ambiente:

```bash
cp .env.local.example .env.local
```

3. Avvia l'app:

```bash
npm run dev
```

## Variabili principali

### Backend

- `DATABASE_URL`: URL Postgres/Supabase, ad esempio `postgresql+psycopg://...`
- `STRIPE_SECRET_KEY`: chiave privata Stripe
- `STRIPE_WEBHOOK_SECRET`: secret `whsec_...` per verificare i webhook Stripe
- `STRIPE_PRICE_CURRENCY`: valuta del checkout
- `FRONTEND_URL`: URL frontend per redirect checkout
- `ADMIN_API_TOKEN`: token Bearer richiesto dalle API admin per creare, modificare, eliminare o importare prodotti

### Frontend

- `NEXT_PUBLIC_API_URL`: URL del backend FastAPI
- `API_URL_SERVER`: URL backend usato dal server Next.js
- `ADMIN_API_TOKEN`: token server-side usato dal proxy interno `/admin-api`
- `ADMIN_USERNAME`: username login admin
- `ADMIN_PASSWORD`: password login admin
- `ADMIN_SESSION_SECRET`: secret usato per firmare la sessione admin `httpOnly`
- `SUPABASE_URL`: URL progetto Supabase per upload immagini admin
- `SUPABASE_SERVICE_ROLE_KEY`: chiave service role usata solo server-side per upload su Storage
- `SUPABASE_STORAGE_BUCKET`: bucket pubblico per immagini prodotto, ad esempio `products`

## Funzionalita incluse

- Catalogo prodotti persistito su Postgres/Supabase
- Seed automatico di prodotti demo stile gioielleria
- API per listing e dettaglio prodotti
- Carrello lato client
- Creazione sessione Stripe Checkout dal backend
- Persistenza ordine relazionale con `orders` e `order_items` prima del redirect a Stripe
- Campo email cliente nel carrello per precompilare il checkout
- UI storefront responsive con hero, griglia prodotti e drawer carrello
- Dashboard admin protetta su `/admin` con login server-side e proxy admin interno

## API Admin

Endpoint backend disponibili:

- `GET /api/admin/products`
- `POST /api/admin/products`
- `PATCH /api/admin/products/{product_id}`
- `DELETE /api/admin/products/{product_id}`
- `POST /api/admin/products/import-json`

La dashboard browser autenticata e disponibile su `http://localhost:3000/admin`.
Le chiamate dal browser passano attraverso il proxy interno `frontend/app/admin-api/*`, che usa `ADMIN_API_TOKEN` solo server-side.

## Tabelle Supabase

- `products`: catalogo prodotti
- `orders`: testata ordine con stato, totale e sessione Stripe
- `order_items`: righe ordine col snapshot del prodotto acquistato

Lo schema pronto da usare e in `backend/supabase_schema.sql`.
