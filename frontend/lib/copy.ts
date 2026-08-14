import { Locale } from "./i18n";

type NavCopy = {
  announcement: string;
  navLeft: string[];
  navRightCollection: string;
  navRightPrivacy: string;
  navCart: string;
  footerCategories: {
    rings: string;
    bracelets: string;
    charms: string;
    earrings: string;
    necklaces: string;
    collection: string;
    brand: string;
    seo: string;
    bestsellers: string;
    giftguide: string;
    stores: string;
    journal: string;
  };
  footerIntroTitle: string;
  footerIntroBody: string;
  footerShopLabel: string;
  footerInfoLabel: string;
  footerOrderStatus: string;
  footerSeoTagline: string;
};

type StorefrontCopy = {
  serviceHighlights: string[];
  categoryPills: string[];
  arrivalsEyebrow: string;
  arrivalsTitle: string;
  arrivalsBody: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredBody: string;
  addToCart: string;
  shopTitle: string;
  shopBody: string;
  seoMeta: string;
  seoTitle: string;
  seoBody: string;
  seoPoints: Array<{ title: string; body: string }>;
  seoLinkLabel: string;
  cartTitle: string;
  cartItems: (count: number) => string;
  cartEmpty: string;
  cartSummaryTitle: string;
  cartSummaryBody: string;
  cartRemove: string;
  cartSubtotal: string;
  cartTotalItems: (count: number) => string;
  cartContinue: string;
  cartClear: string;
  orderEmail: string;
  orderEmailPlaceholder: string;
  totalLabel: string;
  checkoutPending: string;
  checkoutAction: string;
  checkoutUnavailable: string;
};

type SupportPageCopy = {
  successTitle: string;
  successBody: (orderId?: string) => string;
  cancelTitle: string;
  cancelBody: string;
  backToStore: string;
};

type PrivacyCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  sections: Array<{ title: string; body: string }>;
};

export const navCopy: Record<Locale, NavCopy> = {
  it: {
    announcement: "Spedizione gratuita sopra € 120 · Gift packaging incluso · Resi rapidi",
    navLeft: ["Nuovi arrivi", "Charm", "Bracciali", "Anelli"],
    navRightCollection: "Collezione",
    navRightPrivacy: "Privacy",
    navCart: "Bag",
    footerCategories: {
      rings: "Anelli",
      bracelets: "Bracciali",
      charms: "Charm",
      earrings: "Orecchini",
      necklaces: "Collane",
      collection: "Collezione",
      brand: "Brand",
      seo: "Italian Jewelry",
      bestsellers: "Best seller",
      giftguide: "Gift guide",
      stores: "Store locator",
      journal: "Journal",
    },
    footerIntroTitle: "Gioielli da indossare ogni giorno, da regalare, da scegliere con immediatezza.",
    footerIntroBody:
      "Scopri charms, anelli, bracciali, orecchini e collane in una boutique online essenziale e bilingue.",
    footerShopLabel: "Shop",
    footerInfoLabel: "Informazioni",
    footerOrderStatus: "Esito ordine",
    footerSeoTagline: "Jewelry boutique IT / EN",
  },
  en: {
    announcement: "Free shipping over €120 · Gift packaging included · Fast returns",
    navLeft: ["New arrivals", "Charms", "Bracelets", "Rings"],
    navRightCollection: "Collection",
    navRightPrivacy: "Privacy",
    navCart: "Bag",
    footerCategories: {
      rings: "Rings",
      bracelets: "Bracelets",
      charms: "Charms",
      earrings: "Earrings",
      necklaces: "Necklaces",
      collection: "Collection",
      brand: "Brand",
      seo: "Italian Jewelry",
      bestsellers: "Best sellers",
      giftguide: "Gift guide",
      stores: "Store locator",
      journal: "Journal",
    },
    footerIntroTitle: "Jewelry to wear every day, gift beautifully and choose with ease.",
    footerIntroBody:
      "Explore charms, rings, bracelets, earrings and necklaces in a refined bilingual online boutique.",
    footerShopLabel: "Shop",
    footerInfoLabel: "Information",
    footerOrderStatus: "Order status",
    footerSeoTagline: "Jewelry boutique IT / EN",
  },
};

export const storefrontCopy: Record<Locale, StorefrontCopy> = {
  it: {
    serviceHighlights: [
      "Spedizione gratuita sopra € 120",
      "Confezione regalo inclusa",
      "Resi rapidi entro 14 giorni",
    ],
    categoryPills: ["Novita", "Charm", "Bracciali", "Anelli", "Orecchini", "Collane"],
    arrivalsEyebrow: "Novita",
    arrivalsTitle: "Ultimi arrivi",
    arrivalsBody: "Scopri le novita del momento, selezionate per essere indossate o regalate.",
    featuredEyebrow: "Collezione",
    featuredTitle: "Selezione in evidenza",
    featuredBody: "Una selezione curata di pezzi iconici da abbinare con naturalezza.",
    addToCart: "Aggiungi",
    shopTitle: "Tutti i gioielli",
    shopBody: "Esplora l'intera selezione tra charms, bracciali, anelli, orecchini e collane.",
    seoMeta: "Accordi Jewelry",
    seoTitle: "Il mondo Accordi",
    seoBody:
      "Linee luminose, dettagli da regalare e una selezione pensata per accompagnare ogni giorno.",
    seoPoints: [
      {
        title: "Da regalare",
        body: "Pezzi scelti per occasioni speciali, piccoli pensieri e momenti da ricordare.",
      },
      {
        title: "Da abbinare",
        body: "Charms, bracciali e anelli pensati per creare combinazioni personali.",
      },
      {
        title: "Da vivere ogni giorno",
        body: "Materiali luminosi e silhouette pulite per uno stile facile e contemporaneo.",
      },
    ],
    seoLinkLabel: "Scopri Italian Jewelry",
    cartTitle: "Shopping bag",
    cartItems: (count) => `${count} articoli`,
    cartEmpty: "Aggiungi i tuoi pezzi preferiti per iniziare il checkout.",
    cartSummaryTitle: "Selezione corrente",
    cartSummaryBody: "Rivedi i tuoi pezzi, aggiorna le quantita e procedi al checkout quando vuoi.",
    cartRemove: "Rimuovi",
    cartSubtotal: "Subtotale",
    cartTotalItems: (count) => `${count} pezzi nel bag`,
    cartContinue: "Continua lo shopping",
    cartClear: "Svuota bag",
    orderEmail: "Email per l'ordine",
    orderEmailPlaceholder: "cliente@accordi.com",
    totalLabel: "Totale",
    checkoutPending: "Reindirizzamento...",
    checkoutAction: "Vai al checkout",
    checkoutUnavailable: "Checkout non disponibile",
  },
  en: {
    serviceHighlights: [
      "Free shipping over €120",
      "Gift packaging included",
      "Fast 14-day returns",
    ],
    categoryPills: ["New in", "Charms", "Bracelets", "Rings", "Earrings", "Necklaces"],
    arrivalsEyebrow: "New in",
    arrivalsTitle: "Latest arrivals",
    arrivalsBody:
      "Discover the newest pieces of the moment, selected to be worn, layered and gifted.",
    featuredEyebrow: "Collection",
    featuredTitle: "Featured selection",
    featuredBody:
      "A curated edit of signature pieces designed to style naturally together.",
    addToCart: "Add",
    shopTitle: "All jewelry",
    shopBody: "Explore the full edit across charms, bracelets, rings, earrings and necklaces.",
    seoMeta: "Accordi Jewelry",
    seoTitle: "The Accordi world",
    seoBody:
      "Luminous details, gift-ready pieces and a refined selection designed for everyday elegance.",
    seoPoints: [
      {
        title: "Giftable pieces",
        body: "Chosen for special occasions, meaningful gestures and easy gifting.",
      },
      {
        title: "Made to layer",
        body: "Charms, bracelets and rings designed to create personal combinations.",
      },
      {
        title: "Everyday elegance",
        body: "Clean silhouettes and luminous finishes for a modern jewelry wardrobe.",
      },
    ],
    seoLinkLabel: "Discover Italian Jewelry",
    cartTitle: "Shopping bag",
    cartItems: (count) => `${count} items`,
    cartEmpty: "Add your favorite pieces to start checkout.",
    cartSummaryTitle: "Current selection",
    cartSummaryBody: "Review your pieces, adjust quantities and move to checkout whenever you are ready.",
    cartRemove: "Remove",
    cartSubtotal: "Subtotal",
    cartTotalItems: (count) => `${count} pieces in bag`,
    cartContinue: "Continue shopping",
    cartClear: "Clear bag",
    orderEmail: "Order email",
    orderEmailPlaceholder: "client@accordi.com",
    totalLabel: "Total",
    checkoutPending: "Redirecting...",
    checkoutAction: "Proceed to checkout",
    checkoutUnavailable: "Checkout unavailable",
  },
};

export const supportCopy: Record<Locale, SupportPageCopy> = {
  it: {
    successTitle: "Ordine confermato",
    successBody: (orderId) =>
      `Stripe ha completato il pagamento.${orderId ? ` Riferimento ordine: #${orderId}.` : ""}`,
    cancelTitle: "Checkout annullato",
    cancelBody: "Il pagamento non e stato completato. Il carrello resta disponibile lato client.",
    backToStore: "Torna allo store",
  },
  en: {
    successTitle: "Order confirmed",
    successBody: (orderId) =>
      `Stripe completed the payment.${orderId ? ` Order reference: #${orderId}.` : ""}`,
    cancelTitle: "Checkout canceled",
    cancelBody: "The payment was not completed. Your cart remains available on the client side.",
    backToStore: "Back to the store",
  },
};

export const privacyCopy: Record<Locale, PrivacyCopy> = {
  it: {
    eyebrow: "Privacy Policy",
    title: "Informativa privacy per Accordi Jewelry",
    lead:
      "Questa pagina descrive in modo sintetico come vengono trattati i dati personali raccolti tramite navigazione, carrello, checkout e richieste di contatto nel sito Accordi Jewelry.",
    sections: [
      {
        title: "Titolare del trattamento",
        body: "Accordi Jewelry, contattabile all'indirizzo email hello@accordijewelry.com.",
      },
      {
        title: "Dati raccolti",
        body: "Possiamo trattare dati identificativi e di contatto, informazioni necessarie alla gestione del carrello e del checkout, oltre a dati tecnici di navigazione raccolti per sicurezza, performance e funzionamento del sito.",
      },
      {
        title: "Finalita del trattamento",
        body: "I dati sono utilizzati per mostrare il catalogo prodotti, gestire richieste inviate dall'utente, elaborare il checkout tramite Stripe, migliorare l'esperienza di acquisto e adempiere agli obblighi legali applicabili.",
      },
      {
        title: "Base giuridica",
        body: "Il trattamento puo basarsi su esecuzione di misure precontrattuali e contrattuali, adempimento di obblighi di legge e legittimo interesse del titolare alla sicurezza e gestione del servizio.",
      },
      {
        title: "Pagamenti e fornitori terzi",
        body: "Per i pagamenti viene utilizzato Stripe. I dati inseriti nel checkout possono essere trattati dal relativo provider secondo le proprie informative e condizioni contrattuali.",
      },
      {
        title: "Diritti dell'interessato",
        body: "L'utente puo richiedere accesso, rettifica, cancellazione, limitazione o opposizione al trattamento dei dati personali, nei limiti previsti dalla normativa applicabile.",
      },
      {
        title: "Aggiornamenti",
        body: "Questa informativa puo essere aggiornata per riflettere modifiche operative, normative o tecniche del progetto e-commerce.",
      },
    ],
  },
  en: {
    eyebrow: "Privacy Policy",
    title: "Privacy notice for Accordi Jewelry",
    lead:
      "This page briefly explains how personal data collected through browsing, cart activity, checkout and contact requests is handled on the Accordi Jewelry website.",
    sections: [
      {
        title: "Data controller",
        body: "Accordi Jewelry can be contacted at hello@accordijewelry.com.",
      },
      {
        title: "Collected data",
        body: "We may process identification and contact data, information needed to manage the cart and checkout, and technical browsing data required for security, performance and site operations.",
      },
      {
        title: "Purpose of processing",
        body: "Data is used to display the product catalog, manage user requests, process checkout through Stripe, improve the shopping experience and comply with applicable legal obligations.",
      },
      {
        title: "Legal basis",
        body: "Processing may rely on pre-contractual and contractual measures, legal obligations and the controller's legitimate interest in service security and operations.",
      },
      {
        title: "Payments and third-party providers",
        body: "Stripe is used for payments. Data entered during checkout may be processed by that provider according to its own policies and contractual terms.",
      },
      {
        title: "User rights",
        body: "Users may request access, rectification, erasure, restriction or objection regarding personal data processing, within the limits of applicable law.",
      },
      {
        title: "Updates",
        body: "This notice may be updated to reflect operational, regulatory or technical changes to the website and its services.",
      },
    ],
  },
};
