import Link from "next/link";

import { supportCopy } from "../../../../lib/copy";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: { order_id?: string };
}) {
  const copy = supportCopy.it;

  return (
    <main style={{ padding: "64px 24px", maxWidth: 720, margin: "0 auto" }}>
      <h1>{copy.successTitle}</h1>
      <p>{copy.successBody(searchParams?.order_id)}</p>
      <p>
        <Link href="/">{copy.backToStore}</Link>
      </p>
    </main>
  );
}
