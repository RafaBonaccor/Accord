import type { Metadata } from "next";

import { ShoppingBag } from "../../../../components/shopping-bag";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "Review your selected pieces, adjust quantities and proceed to checkout.",
  alternates: {
    canonical: "/en/cart",
    languages: {
      en: "/en/cart",
      it: "/cart",
    },
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function EnCartPage() {
  return <ShoppingBag locale="en" continueHref="/en#shop" standalone />;
}
