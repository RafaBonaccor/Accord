import type { Metadata } from "next";

import { ShoppingBag } from "../../../components/shopping-bag";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "Rivedi gli articoli selezionati, aggiorna le quantita e procedi al checkout.",
  alternates: {
    canonical: "/cart",
    languages: {
      it: "/cart",
      en: "/en/cart",
    },
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <ShoppingBag locale="it" continueHref="/#shop" standalone />;
}
