export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: { order_id?: string };
}) {
  return (
    <main style={{ padding: "64px 24px", maxWidth: 720, margin: "0 auto" }}>
      <h1>Ordine confermato</h1>
      <p>
        Stripe ha completato il pagamento.
        {searchParams?.order_id ? ` Riferimento ordine: #${searchParams.order_id}.` : ""}
      </p>
    </main>
  );
}
