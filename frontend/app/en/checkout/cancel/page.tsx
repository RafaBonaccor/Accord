import Link from "next/link";

import { supportCopy } from "../../../../lib/copy";

export default function EnglishCheckoutCancelPage() {
  const copy = supportCopy.en;

  return (
    <main style={{ padding: "64px 24px", maxWidth: 720, margin: "0 auto" }} lang="en">
      <h1>{copy.cancelTitle}</h1>
      <p>{copy.cancelBody}</p>
      <p>
        <Link href="/en">{copy.backToStore}</Link>
      </p>
    </main>
  );
}
