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
- `STRIPE_PRICE_CURRENCY`: valuta del checkout
- `FRONTEND_URL`: URL frontend per redirect checkout

### Frontend

- `NEXT_PUBLIC_API_URL`: URL del backend FastAPI

## Funzionalita incluse

- Catalogo prodotti persistito su Postgres/Supabase
- Seed automatico di prodotti demo stile gioielleria
- API per listing e dettaglio prodotti
- Carrello lato client
- Creazione sessione Stripe Checkout dal backend
- Persistenza ordine relazionale con `orders` e `order_items` prima del redirect a Stripe
- Campo email cliente nel carrello per precompilare il checkout
- UI storefront responsive con hero, griglia prodotti e drawer carrello

## Tabelle Supabase

- `products`: catalogo prodotti
- `orders`: testata ordine con stato, totale e sessione Stripe
- `order_items`: righe ordine col snapshot del prodotto acquistato

Lo schema pronto da usare e in `backend/supabase_schema.sql`.
