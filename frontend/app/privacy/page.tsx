import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Informativa privacy di Accordi Jewelry per navigazione, checkout, contatti e gestione dei dati personali nel mercato italiano.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-page-inner">
        <p className="legal-eyebrow">Privacy Policy</p>
        <h1>Informativa privacy per Accordi Jewelry</h1>
        <p className="legal-lead">
          Questa pagina descrive in modo sintetico come vengono trattati i dati personali raccolti
          tramite navigazione, carrello, checkout e richieste di contatto nel sito Accordi Jewelry.
        </p>

        <section>
          <h2>Titolare del trattamento</h2>
          <p>
            Accordi Jewelry, contattabile all&apos;indirizzo email
            {" "}
            <a href="mailto:hello@accordijewelry.com">hello@accordijewelry.com</a>.
          </p>
        </section>

        <section>
          <h2>Dati raccolti</h2>
          <p>
            Possiamo trattare dati identificativi e di contatto, informazioni necessarie alla
            gestione del carrello e del checkout, oltre a dati tecnici di navigazione raccolti per
            sicurezza, performance e funzionamento del sito.
          </p>
        </section>

        <section>
          <h2>Finalita del trattamento</h2>
          <p>
            I dati sono utilizzati per mostrare il catalogo prodotti, gestire richieste inviate
            dall&apos;utente, elaborare il checkout tramite Stripe, migliorare l&apos;esperienza di
            acquisto e adempiere agli obblighi legali applicabili.
          </p>
        </section>

        <section>
          <h2>Base giuridica</h2>
          <p>
            Il trattamento puo basarsi su esecuzione di misure precontrattuali e contrattuali,
            adempimento di obblighi di legge e legittimo interesse del titolare alla sicurezza e
            gestione del servizio.
          </p>
        </section>

        <section>
          <h2>Pagamenti e fornitori terzi</h2>
          <p>
            Per i pagamenti viene utilizzato Stripe. I dati inseriti nel checkout possono essere
            trattati dal relativo provider secondo le proprie informative e condizioni contrattuali.
          </p>
        </section>

        <section>
          <h2>Diritti dell&apos;interessato</h2>
          <p>
            L&apos;utente puo richiedere accesso, rettifica, cancellazione, limitazione o opposizione
            al trattamento dei dati personali, nei limiti previsti dalla normativa applicabile.
          </p>
        </section>

        <section>
          <h2>Aggiornamenti</h2>
          <p>
            Questa informativa puo essere aggiornata per riflettere modifiche operative, normative o
            tecniche del progetto e-commerce.
          </p>
        </section>
      </div>
    </main>
  );
}
