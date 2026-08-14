import type { Metadata } from "next";

import { privacyCopy } from "../../../../lib/copy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy notice for Accordi Jewelry covering browsing, checkout, contact requests and personal data handling for the English website.",
  alternates: {
    canonical: "/en/privacy",
    languages: {
      en: "/en/privacy",
      it: "/privacy",
    },
  },
};

export default function EnglishPrivacyPage() {
  const copy = privacyCopy.en;

  return (
    <main className="legal-page" lang="en">
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
