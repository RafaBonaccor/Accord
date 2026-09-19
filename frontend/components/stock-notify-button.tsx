"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { createStockNotification } from "../lib/api";
import type { Locale } from "../lib/i18n";
import styles from "./stock-notify-button.module.css";

type Props = {
  locale: Locale;
  productId: number;
  productName: string;
};

const copy = {
  it: {
    action: "AVVISAMI",
    title: "Avvisami quando torna disponibile",
    intro: "Lascia la tua email: ti avviseremo appena questo prodotto sara di nuovo disponibile.",
    email: "Email",
    placeholder: "cliente@accordi.com",
    submit: "Conferma avviso",
    pending: "Salvataggio...",
    close: "Chiudi",
    success: "Richiesta salvata. Ti avviseremo appena torna disponibile.",
    error: "Non siamo riusciti a salvare la richiesta. Riprova.",
  },
  en: {
    action: "NOTIFY ME",
    title: "Notify me when available",
    intro: "Leave your email and we will notify you as soon as this product is available again.",
    email: "Email",
    placeholder: "customer@accordi.com",
    submit: "Confirm alert",
    pending: "Saving...",
    close: "Close",
    success: "Request saved. We will notify you as soon as it is available.",
    error: "We could not save the request. Please try again.",
  },
} as const;

export function StockNotifyButton({ locale, productId, productName }: Props) {
  const labels = copy[locale];
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);

    try {
      await createStockNotification(productId, email, locale);
      setMessage(labels.success);
      setEmail("");
    } catch {
      setError(labels.error);
    } finally {
      setPending(false);
    }
  }

  function closeDialog() {
    setOpen(false);
    setMessage(null);
    setError(null);
  }

  return (
    <>
      <button type="button" className={styles.trigger} onClick={() => setOpen(true)}>
        {labels.action}
      </button>

      {open ? (
        <div className={styles.overlay} role="presentation" onMouseDown={closeDialog}>
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`stock-notify-title-${productId}`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button type="button" className={styles.closeButton} onClick={closeDialog} aria-label={labels.close}>
              ×
            </button>
            <p className={styles.eyebrow}>Out of stock</p>
            <h2 id={`stock-notify-title-${productId}`}>{labels.title}</h2>
            <p className={styles.productName}>{productName}</p>
            <p className={styles.intro}>{labels.intro}</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label>
                <span>{labels.email}</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={labels.placeholder}
                />
              </label>
              <button type="submit" disabled={pending}>
                {pending ? labels.pending : labels.submit}
              </button>
            </form>
            {message ? <p className={styles.success}>{message}</p> : null}
            {error ? <p className={styles.error}>{error}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
