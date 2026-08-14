import { Locale } from "./i18n";

export type CatalogPageCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  panelTitle: string;
  panelBody: string;
  bullets: string[];
  primaryLabel: string;
  secondaryLabel: string;
  sectionTitle: string;
  sectionBody: string;
  storyTitle?: string;
  storyBlocks?: Array<{ title: string; body: string }>;
};

export const arrivalsPageCopy: Record<Locale, CatalogPageCopy> = {
  it: {
    eyebrow: "Novita",
    title: "Nuovi arrivi da scoprire subito",
    intro: "Una selezione aggiornata di nuovi arrivi da scoprire e indossare subito.",
    panelTitle: "Nuove ispirazioni da regalare e abbinare",
    panelBody: "Pezzi recenti, dettagli luminosi e una selezione pensata per il quotidiano.",
    bullets: ["Nuovi drop da scoprire", "Idee regalo immediate", "Stile essenziale e contemporaneo"],
    primaryLabel: "Vai allo shop",
    secondaryLabel: "Scopri la collezione",
    sectionTitle: "Ultimi arrivi",
    sectionBody: "Una selezione dei prodotti piu recenti, scelti per stile, luminosita e versatilita.",
  },
  en: {
    eyebrow: "New arrivals",
    title: "New pieces to discover right away",
    intro: "An updated edit of new arrivals to discover, wear and gift right away.",
    panelTitle: "Fresh pieces to style your way",
    panelBody: "Recent designs, luminous details and a selection made for everyday elegance.",
    bullets: ["New drops to explore", "Easy gift ideas", "Clean contemporary styling"],
    primaryLabel: "Go to shop",
    secondaryLabel: "Explore collection",
    sectionTitle: "Latest arrivals",
    sectionBody: "A selection of the latest products chosen for style, shine and versatility.",
  },
};

export const categoryPageCopy: Record<Locale, Record<string, CatalogPageCopy>> = {
  it: {
    bracelets: {
      eyebrow: "Bracciali",
      title: "Bracciali da indossare tutti i giorni",
      intro: "Bracciali luminosi da indossare ogni giorno o scegliere per un regalo speciale.",
      panelTitle: "Linee essenziali, dettagli da abbinare",
      panelBody: "Una selezione di modelli versatili, pensati per layering e stile quotidiano.",
      bullets: ["Tennis, catene e silhouette pulite", "Prezzi e materiali subito leggibili", "Percorso rapido verso il checkout"],
      primaryLabel: "Apri lo shop",
      secondaryLabel: "Torna alla home",
      sectionTitle: "Bracciali",
      sectionBody: "Selezione completa di bracciali pensata per regali, layering e stile quotidiano.",
    },
    rings: {
      eyebrow: "Anelli",
      title: "Anelli luminosi e modelli da regalare",
      intro: "Anelli luminosi, facili da abbinare e perfetti anche come idea regalo.",
      panelTitle: "Modelli da indossare con naturalezza",
      panelBody: "Dal dettaglio essenziale ai pezzi piu brillanti, ogni anello e pensato per valorizzare il gesto.",
      bullets: ["Silhouette pulite", "Stile quotidiano", "Dettagli da regalare"],
      primaryLabel: "Apri lo shop",
      secondaryLabel: "Torna alla home",
      sectionTitle: "Anelli",
      sectionBody: "Anelli selezionati per brillantezza, regali e stile quotidiano.",
    },
    charms: {
      eyebrow: "Charms",
      title: "Charms da collezionare e combinare",
      intro: "Charms da scegliere, collezionare e combinare in modo personale.",
      panelTitle: "Piccoli dettagli, grande personalita",
      panelBody: "Una selezione pensata per creare composizioni uniche e idee regalo leggere.",
      bullets: ["Da collezionare", "Facili da abbinare", "Perfetti da regalare"],
      primaryLabel: "Apri lo shop",
      secondaryLabel: "Torna alla home",
      sectionTitle: "Charms",
      sectionBody: "Una selezione di charms costruita per composizioni personali e piccoli regali.",
    },
    earrings: {
      eyebrow: "Orecchini",
      title: "Orecchini essenziali e modelli da layering",
      intro: "Orecchini essenziali e luminosi per accompagnare ogni look con leggerezza.",
      panelTitle: "Dettagli versatili da ogni giorno",
      panelBody: "Modelli facili da indossare, da abbinare e da regalare.",
      bullets: ["Stile pulito", "Look quotidiani", "Idee regalo raffinate"],
      primaryLabel: "Apri lo shop",
      secondaryLabel: "Torna alla home",
      sectionTitle: "Orecchini",
      sectionBody: "Orecchini pensati per l'uso quotidiano, idee regalo e layering leggero.",
    },
    necklaces: {
      eyebrow: "Collane",
      title: "Collane da sovrapporre e regalare",
      intro: "Collane da sovrapporre, regalare e indossare con naturalezza.",
      panelTitle: "Layering luminoso e femminile",
      panelBody: "Catene, punti luce e dettagli delicati per creare combinazioni personali.",
      bullets: ["Perfette da sovrapporre", "Eleganza quotidiana", "Regali dal gusto contemporaneo"],
      primaryLabel: "Apri lo shop",
      secondaryLabel: "Torna alla home",
      sectionTitle: "Collane",
      sectionBody: "Collane selezionate per layering, regali e look contemporanei.",
    },
  },
  en: {
    bracelets: {
      eyebrow: "Bracelets",
      title: "Bracelets for everyday styling",
      intro: "Luminous bracelets to wear every day or choose for a special gift.",
      panelTitle: "Clean lines, easy layering",
      panelBody: "A versatile edit designed for stacking, gifting and everyday styling.",
      bullets: ["Tennis, chain and clean silhouettes", "Price and materials visible immediately", "Fast path to purchase"],
      primaryLabel: "Open shop",
      secondaryLabel: "Back to home",
      sectionTitle: "Bracelets",
      sectionBody: "A complete bracelet edit designed for gifting, layering and everyday styling.",
    },
    rings: {
      eyebrow: "Rings",
      title: "Luminous rings and gift-ready styles",
      intro: "Luminous rings that feel easy to style and beautiful to gift.",
      panelTitle: "Styles to wear naturally",
      panelBody: "From minimal details to brighter pieces, each ring is designed to elevate everyday gestures.",
      bullets: ["Clean silhouettes", "Everyday styling", "Gift-ready details"],
      primaryLabel: "Open shop",
      secondaryLabel: "Back to home",
      sectionTitle: "Rings",
      sectionBody: "Rings selected for shine, gifting and everyday wear.",
    },
    charms: {
      eyebrow: "Charms",
      title: "Charms to collect and combine",
      intro: "Charms to choose, collect and combine in a personal way.",
      panelTitle: "Small details, strong personality",
      panelBody: "A selection designed for unique combinations and light, meaningful gifting.",
      bullets: ["Collectible pieces", "Easy to mix", "Perfect for gifting"],
      primaryLabel: "Open shop",
      secondaryLabel: "Back to home",
      sectionTitle: "Charms",
      sectionBody: "A charm selection designed for personal combinations and small gifting moments.",
    },
    earrings: {
      eyebrow: "Earrings",
      title: "Essential earrings and layering-ready styles",
      intro: "Essential, luminous earrings designed to complete everyday looks with ease.",
      panelTitle: "Versatile details for every day",
      panelBody: "Styles made to wear, pair and gift with natural simplicity.",
      bullets: ["Clean styling", "Everyday looks", "Refined gift ideas"],
      primaryLabel: "Open shop",
      secondaryLabel: "Back to home",
      sectionTitle: "Earrings",
      sectionBody: "Earrings selected for everyday wear, gifting and light layering.",
    },
    necklaces: {
      eyebrow: "Necklaces",
      title: "Necklaces to layer and gift",
      intro: "Necklaces designed to layer, gift and wear with natural elegance.",
      panelTitle: "Luminous layering with a feminine touch",
      panelBody: "Chains, points of light and delicate details to build personal combinations.",
      bullets: ["Perfect for layering", "Everyday elegance", "Modern gift options"],
      primaryLabel: "Open shop",
      secondaryLabel: "Back to home",
      sectionTitle: "Necklaces",
      sectionBody: "Necklaces selected for layering, gifting and contemporary looks.",
    },
  },
};

export const collectionPageCopy: Record<Locale, CatalogPageCopy> = {
  it: {
    eyebrow: "Collezione",
    title: "Una collezione raccontata con piu respiro",
    intro: "Una selezione che racconta il gusto Accordi tra pezzi da indossare, regalare e abbinare.",
    panelTitle: "Una collezione da vivere con naturalezza",
    panelBody: "Prodotti in evidenza e dettagli luminosi si incontrano in un racconto essenziale e raffinato.",
    bullets: ["Prodotto e ispirazione", "Eleganza quotidiana", "Pezzi da combinare"],
    primaryLabel: "Vedi tutti i gioielli",
    secondaryLabel: "Scopri il brand",
    sectionTitle: "Prodotti della collezione",
    sectionBody: "Una selezione dei pezzi che meglio rappresentano il linguaggio visivo dello store.",
    storyTitle: "Come leggere la collezione",
    storyBlocks: [
      {
        title: "Layering",
        body: "Una proposta pensata per essere combinata in modo naturale tra anelli, collane e bracciali.",
      },
      {
        title: "Gifting",
        body: "La collezione mantiene un taglio chiaro per acquisti regalo, senza rendere dispersiva la navigazione.",
      },
      {
        title: "Stile",
        body: "Una collezione pensata per far convivere essenzialita, luce e femminilita.",
      },
    ],
  },
  en: {
    eyebrow: "Collection",
    title: "A collection page with more room to breathe",
    intro: "A selection that expresses the Accordi point of view through pieces to wear, gift and layer.",
    panelTitle: "A collection to live naturally",
    panelBody: "Featured products and luminous details come together in a refined, essential edit.",
    bullets: ["Product and inspiration", "Everyday elegance", "Pieces to combine"],
    primaryLabel: "View all jewelry",
    secondaryLabel: "Discover the brand",
    sectionTitle: "Collection highlights",
    sectionBody: "A selection of products that best represent the visual language of the store.",
    storyTitle: "How to read the collection",
    storyBlocks: [
      {
        title: "Layering",
        body: "The selection is designed to mix naturally across rings, necklaces and bracelets.",
      },
      {
        title: "Gifting",
        body: "The collection stays clear for gift shopping without making navigation feel overloaded.",
      },
      {
        title: "Style",
        body: "A collection shaped around essential lines, light and contemporary femininity.",
      },
    ],
  },
};

export const brandPageCopy: Record<Locale, CatalogPageCopy> = {
  it: {
    eyebrow: "Brand",
    title: "Il mondo Accordi",
    intro: "Il mondo Accordi prende forma attraverso dettagli luminosi, femminilita contemporanea e gusto per il regalo.",
    panelTitle: "Un universo essenziale e riconoscibile",
    panelBody: "Una pagina dedicata al brand per raccontare stile, sensibilita e atmosfera della collezione.",
    bullets: ["Identita chiara", "Tono raffinato", "Racconto del brand"],
    primaryLabel: "Vai alla collezione",
    secondaryLabel: "Torna alla home",
    sectionTitle: "Una selezione dal mondo Accordi",
    sectionBody: "Prodotti e contenuti che aiutano a definire il tono del marchio senza appesantire l'esperienza di acquisto.",
    storyTitle: "Tre punti del brand",
    storyBlocks: [
      {
        title: "Stile",
        body: "Gioielli pensati per un gusto contemporaneo, facile da indossare e da regalare.",
      },
      {
        title: "Esperienza",
        body: "Un modo di scegliere il gioiello semplice, curato e immediato.",
      },
      {
        title: "Dettagli",
        body: "Ogni pezzo e pensato per accompagnare momenti quotidiani e occasioni da ricordare.",
      },
    ],
  },
  en: {
    eyebrow: "Brand",
    title: "The Accordi world",
    intro: "The Accordi world takes shape through luminous details, contemporary femininity and a gift-ready sensibility.",
    panelTitle: "An essential and recognizable universe",
    panelBody: "A dedicated brand page to express the mood, style and atmosphere behind the collection.",
    bullets: ["Clear identity", "Refined tone", "Brand storytelling"],
    primaryLabel: "Go to collection",
    secondaryLabel: "Back to home",
    sectionTitle: "A selection from the Accordi world",
    sectionBody: "Products and content that help define the brand tone without weighing down the shopping experience.",
    storyTitle: "Three brand pillars",
    storyBlocks: [
      {
        title: "Style",
        body: "Jewelry designed for a contemporary taste that feels easy to wear and easy to gift.",
      },
      {
        title: "Experience",
        body: "A simple, curated and immediate way to choose jewelry.",
      },
      {
        title: "Details",
        body: "Each piece is designed to accompany everyday moments and memorable occasions.",
      },
    ],
  },
};

export const bestSellerPageCopy: Record<Locale, CatalogPageCopy> = {
  it: {
    eyebrow: "Best seller",
    title: "I pezzi piu richiesti dello store",
    intro: "I gioielli piu amati della collezione, scelti per stile, versatilita e desiderabilita.",
    panelTitle: "I preferiti da scoprire subito",
    panelBody: "Una selezione di pezzi iconici da regalare, indossare e abbinare con facilita.",
    bullets: ["Pezzi piu richiesti", "Facili da scegliere", "Perfetti da regalare"],
    primaryLabel: "Vai allo shop",
    secondaryLabel: "Scopri la collezione",
    sectionTitle: "Best seller",
    sectionBody: "Una selezione di prodotti in evidenza da scoprire, regalare e indossare ogni giorno.",
  },
  en: {
    eyebrow: "Best sellers",
    title: "The store’s most requested pieces",
    intro: "The most loved pieces in the collection, chosen for style, versatility and desirability.",
    panelTitle: "Favorites to discover right away",
    panelBody: "A selection of signature pieces to gift, wear and combine with ease.",
    bullets: ["Most requested styles", "Easy to choose", "Perfect for gifting"],
    primaryLabel: "Go to shop",
    secondaryLabel: "Explore collection",
    sectionTitle: "Best sellers",
    sectionBody: "A highlighted selection of pieces to discover, gift and wear every day.",
  },
};

export const giftGuidePageCopy: Record<Locale, CatalogPageCopy> = {
  it: {
    eyebrow: "Gift guide",
    title: "Idee regalo da scegliere piu velocemente",
    intro: "Una selezione di idee regalo pensata per aiutarti a scegliere con immediatezza.",
    panelTitle: "Regali facili da amare",
    panelBody: "Pezzi luminosi, versatili e dal gusto contemporaneo per occasioni speciali e piccoli pensieri.",
    bullets: ["Idee regalo immediate", "Selezione versatile", "Scelte piu semplici"],
    primaryLabel: "Vedi i regali",
    secondaryLabel: "Torna alla home",
    sectionTitle: "Gift selection",
    sectionBody: "Una selezione pensata per regali facili da scegliere e con percezione premium.",
  },
  en: {
    eyebrow: "Gift guide",
    title: "Gift ideas that are faster to choose",
    intro: "A gift edit designed to help you choose beautifully and quickly.",
    panelTitle: "Pieces that are easy to love",
    panelBody: "Luminous, versatile styles with a contemporary feel for special occasions and thoughtful gifts.",
    bullets: ["Easy gift ideas", "Versatile selection", "Simpler choices"],
    primaryLabel: "View gifts",
    secondaryLabel: "Back to home",
    sectionTitle: "Gift selection",
    sectionBody: "A selection designed for easier gifting choices with a premium feel.",
  },
};

export const storeLocatorPageCopy: Record<Locale, CatalogPageCopy> = {
  it: {
    eyebrow: "Store locator",
    title: "Dove trovare il mondo Accordi",
    intro: "Un modo per immaginare i luoghi e i riferimenti che raccontano l'universo Accordi.",
    panelTitle: "Presenza, atmosfera, ispirazione",
    panelBody: "Una pagina che avvicina il brand a citta, momenti e incontri dal gusto contemporaneo.",
    bullets: ["Mood di brand", "Ispirazione urbana", "Presenza evocativa"],
    primaryLabel: "Scopri il brand",
    secondaryLabel: "Torna alla home",
    sectionTitle: "Store selection",
    sectionBody: "Una selezione simbolica di citta e riferimenti per raccontare l'atmosfera del brand.",
    storyTitle: "Luoghi",
    storyBlocks: [
      { title: "Milano", body: "Una cornice luminosa per presentazioni, capsule e appuntamenti dedicati." },
      { title: "Roma", body: "Un riferimento per regali, occasioni speciali e novita della stagione." },
      { title: "Online", body: "Il luogo piu immediato per scoprire la collezione e scegliere i propri preferiti." },
    ],
  },
  en: {
    eyebrow: "Store locator",
    title: "Where to find the Accordi world",
    intro: "A way to imagine the places and references that express the Accordi world.",
    panelTitle: "Presence, atmosphere, inspiration",
    panelBody: "A page that connects the brand to cities, moments and encounters with a contemporary feel.",
    bullets: ["Brand mood", "Urban inspiration", "Evocative presence"],
    primaryLabel: "Discover the brand",
    secondaryLabel: "Back to home",
    sectionTitle: "Store selection",
    sectionBody: "A symbolic selection of cities and references used to express the brand atmosphere.",
    storyTitle: "Places",
    storyBlocks: [
      { title: "Milan", body: "A luminous setting for presentations, capsule launches and dedicated appointments." },
      { title: "Rome", body: "A reference point for gifting, special occasions and seasonal pieces." },
      { title: "Online", body: "The most immediate place to discover the collection and choose your favorites." },
    ],
  },
};

export const journalPageCopy: Record<Locale, CatalogPageCopy> = {
  it: {
    eyebrow: "Journal",
    title: "Novita, ispirazioni e storie di collezione",
    intro: "Novita, ispirazioni e storie per vivere la collezione con uno sguardo piu vicino al brand.",
    panelTitle: "Contenuti da sfogliare con leggerezza",
    panelBody: "Idee regalo, trend e racconti brevi pensati per accompagnare il prodotto con naturalezza.",
    bullets: ["Ispirazioni stagionali", "Idee da regalare", "Storie di collezione"],
    primaryLabel: "Vai alle novita",
    secondaryLabel: "Scopri il brand",
    sectionTitle: "Stories & highlights",
    sectionBody: "Una selezione di contenuti da sfogliare per scoprire meglio stile, momenti e collezione.",
    storyTitle: "Temi del journal",
    storyBlocks: [
      { title: "Trend", body: "Layering, regali, capsule e focus materiali raccontati con taglio breve." },
      { title: "Campagne", body: "Approfondimenti su lanci, stagionalita e selezioni della collezione." },
      { title: "Brand notes", body: "Piccoli contenuti istituzionali che mantengono il tono premium dello store." },
    ],
  },
  en: {
    eyebrow: "Journal",
    title: "Newness, inspiration and collection stories",
    intro: "Newness, inspiration and stories designed to bring you closer to the collection.",
    panelTitle: "Content to browse with ease",
    panelBody: "Gift ideas, trends and short stories created to accompany the product naturally.",
    bullets: ["Seasonal inspiration", "Gift ideas", "Collection stories"],
    primaryLabel: "Go to new arrivals",
    secondaryLabel: "Discover the brand",
    sectionTitle: "Stories & highlights",
    sectionBody: "A selection of content highlights to discover more of the collection, its mood and its moments.",
    storyTitle: "Journal themes",
    storyBlocks: [
      { title: "Trends", body: "Layering, gifts, capsule launches and material stories told in a compact way." },
      { title: "Campaigns", body: "Short features on launches, seasonality and collection highlights." },
      { title: "Brand notes", body: "Short brand stories that keep the tone refined and contemporary." },
    ],
  },
};
