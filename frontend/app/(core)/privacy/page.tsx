import type { Metadata } from "next";

import { privacyCopy } from "../../../lib/copy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Informativa privacy di Accordi Jewelry per navigazione, checkout, contatti e gestione dei dati personali nel mercato italiano.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const copy = privacyCopy.it;

  return (
    <main className="legal-page">
      <div className="legal-page-inner">
        <p className="legal-eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="legal-lead">{copy.lead}</p>
        {copy.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
