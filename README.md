# Accordi Jewelry

Base e-commerce per gioielli con frontend Next.js e backend FastAPI, catalogo prodotti, carrello e checkout Stripe.

## Struttura

- `frontend`: storefront Next.js 14 con App Router
- `backend`: API FastAPI con SQLite e Stripe Checkout

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

4. Avvia l'API:

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

- `DATABASE_URL`: default SQLite locale
- `STRIPE_SECRET_KEY`: chiave privata Stripe
- `STRIPE_PRICE_CURRENCY`: valuta del checkout
- `FRONTEND_URL`: URL frontend per redirect checkout

### Frontend

- `NEXT_PUBLIC_API_URL`: URL del backend FastAPI

## Funzionalita incluse

- Catalogo prodotti persistito in SQLite
- Seed automatico di prodotti demo stile gioielleria
- API per listing e dettaglio prodotti
- Carrello lato client
- Creazione sessione Stripe Checkout dal backend
- Persistenza locale di un record ordine prima del redirect a Stripe
- Campo email cliente nel carrello per precompilare il checkout
- UI storefront responsive con hero, griglia prodotti e drawer carrello
