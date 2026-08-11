import { Locale } from "./i18n";

type NavCopy = {
  announcement: string;
  navLeft: string[];
  navRightCollection: string;
  navRightStore: string;
  navRightPrivacy: string;
  footerIntroTitle: string;
  footerIntroBody: string;
  footerShopLabel: string;
  footerInfoLabel: string;
  footerOrderStatus: string;
  footerSeoTagline: string;
  languageSwitch: string;
};

type StorefrontCopy = {
  eyebrow: string;
  heroTitle: string;
  heroLead: string;
  primaryAction: string;
  secondaryAction: string;
  languageAction: string;
  heroCardLabel: string;
  heroCardTitle: string;
  heroCardBody: string;
  categoryPills: string[];
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
    announcement: "Gioielli italiani online · Spedizione gratuita sopra € 120 · Gift packaging incluso",
    navLeft: ["Nuovi arrivi", "Charm", "Bracciali", "Anelli"],
    navRightCollection: "Collezione",
    navRightStore: "Store English",
    navRightPrivacy: "Privacy",
    footerIntroTitle: "Gioielleria online italiana dal carattere contemporaneo.",
    footerIntroBody:
      "Base e-commerce per gioielli con catalogo, carrello e checkout pensata per un brand premium nel mercato italiano e per la crescita SEO internazionale su keyword come Italian jewelry.",
    footerShopLabel: "Shop",
    footerInfoLabel: "Informazioni",
    footerOrderStatus: "Esito ordine",
    footerSeoTagline: "Made for Italian jewelry SEO",
    languageSwitch: "English",
  },
  en: {
    announcement: "Italian jewelry online · Free shipping over €120 · Gift packaging included",
    navLeft: ["New arrivals", "Charms", "Bracelets", "Rings"],
    navRightCollection: "Collection",
    navRightStore: "Store in Italian",
    navRightPrivacy: "Privacy",
    footerIntroTitle: "Italian jewelry e-commerce with a contemporary premium direction.",
    footerIntroBody:
      "Jewelry storefront with catalog, cart and checkout designed for a premium brand serving both Italian and English-speaking customers.",
    footerShopLabel: "Shop",
    footerInfoLabel: "Information",
    footerOrderStatus: "Order status",
    footerSeoTagline: "Built for bilingual jewelry shopping",
    languageSwitch: "Italiano",
  },
};

export const storefrontCopy: Record<Locale, StorefrontCopy> = {
  it: {
    eyebrow: "Italian Jewelry · Gioielli Italiani",
    heroTitle: "Italian jewelry online tra charm, anelli e bracciali da regalare.",
    heroLead:
      "Accordi Jewelry propone una selezione di Italian jewelry e gioielli donna online con stile premium, design contemporaneo e una base e-commerce pronta per il mercato italiano e per ricerche internazionali in inglese.",
    primaryAction: "Acquista ora",
    secondaryAction: "Scopri la collezione",
    languageAction: "Switch to English",
    heroCardLabel: "Best gift edit",
    heroCardTitle: "Shine in layers",
    heroCardBody: "Mix di metalli caldi, charm iconici e silhouette pulite.",
    categoryPills: ["Charm da collezione", "Bracciali iconici", "Anelli luminosi", "Gift sets"],
    addToCart: "Aggiungi",
    shopTitle: "Shop all jewelry",
    shopBody: "Catalogo FastAPI + Supabase, pronto per un storefront bilingue.",
    seoMeta: "Gioielleria online italiana · Italian jewelry",
    seoTitle: "Acquista gioielli donna online con un’identita italiana chiara e rilevanza internazionale.",
    seoBody:
      "Questa homepage e pensata per intercettare ricerche come gioielli italiani, gioielli donna online, italian jewelry, italian jewelry online, charm eleganti, anelli da regalo e bracciali premium. Il tono visivo e commerciale aiuta il posizionamento del brand su un target femminile interessato a gifting, collezioni stagionali e acquisto diretto sia in italiano sia in inglese.",
    seoPoints: [
      {
        title: "Keyword focus",
        body: "gioielli italiani, italian jewelry, italian jewelry online, anelli donna, charms e bracciali.",
      },
      {
        title: "Intento di ricerca",
        body: "Acquisto diretto, gift ideas, premium collections e modern italian jewelry.",
      },
      {
        title: "Contenuto bilingue SEO",
        body: "Copy e metadata pensati per keyword italiane e inglesi con focus su Italian jewelry.",
      },
    ],
    seoLinkLabel: "Vai alla landing English SEO",
    cartTitle: "Shopping bag",
    cartItems: (count) => `${count} articoli`,
    cartEmpty: "Aggiungi i tuoi pezzi preferiti per iniziare il checkout.",
    orderEmail: "Email per l'ordine",
    orderEmailPlaceholder: "cliente@accordi.com",
    totalLabel: "Totale",
    checkoutPending: "Reindirizzamento...",
    checkoutAction: "Vai al checkout",
    checkoutUnavailable: "Checkout non disponibile",
  },
  en: {
    eyebrow: "Italian Jewelry · Women's Jewelry",
    heroTitle: "Italian jewelry online with charms, rings and bracelets made for gifting.",
    heroLead:
      "Accordi Jewelry offers a premium edit of Italian jewelry for women with contemporary design, polished styling and a shopping experience ready for both Italian and English-speaking customers.",
    primaryAction: "Shop now",
    secondaryAction: "Discover the collection",
    languageAction: "Passa all'italiano",
    heroCardLabel: "Gift spotlight",
    heroCardTitle: "Layered glow",
    heroCardBody: "Warm metals, iconic charms and clean silhouettes for everyday elegance.",
    categoryPills: ["Collectible charms", "Signature bracelets", "Luminous rings", "Gift sets"],
    addToCart: "Add",
    shopTitle: "Shop all jewelry",
    shopBody: "FastAPI + Supabase catalog, ready for a bilingual storefront.",
    seoMeta: "Italian jewelry online · Jewelry gifts",
    seoTitle: "Shop women’s jewelry with an Italian identity and a clear English-language buying experience.",
    seoBody:
      "This storefront is designed for searches such as Italian jewelry, jewelry gifts for women, charm bracelets, stackable rings and elevated everyday accessories. The copy, navigation and checkout flow now support a genuine bilingual shopping experience rather than a single translated landing page.",
    seoPoints: [
      {
        title: "Keyword focus",
        body: "Italian jewelry, jewelry gifts for women, charm bracelets, rings, premium bracelets.",
      },
      {
        title: "Search intent",
        body: "Direct purchase, gifting, layering and modern Italian design.",
      },
      {
        title: "Bilingual storefront",
        body: "Navigation, cart and support pages are available in both Italian and English.",
      },
    ],
    seoLinkLabel: "Visit the English SEO landing",
    cartTitle: "Shopping bag",
    cartItems: (count) => `${count} items`,
    cartEmpty: "Add your favorite pieces to start checkout.",
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
        body: "This notice may be updated to reflect operational, regulatory or technical changes to the e-commerce project.",
      },
    ],
  },
};
