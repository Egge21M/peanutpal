import { useEffect, useState } from "react";
import NumberPad from "../components/NumberPad";
import type { MintQuoteResponse } from "@cashu/cashu-ts";
import { wallet } from "../wallet";
import InvoiceModal from "../components/InvoiceModal";
import confetti from "canvas-confetti";
import { walletService } from "../services";

function HomeRoute() {
  const [quote, setQuote] = useState<MintQuoteResponse>();
  const [resetTrigger, setResetTrigger] = useState(0);
  async function handleSubmit(amount: number) {
    const quote = await wallet.createMintQuote(amount);
    setQuote(quote);
  }
  useEffect(() => {
    if (quote) {
      wallet.onMintQuotePaid(
        quote.quote,
        async () => {
          // Process payment through wallet service
          const result = await walletService.processPaidInvoice(quote);

          setQuote(undefined);

          if (result.success) {
            // Reset the NumberPad input to zero
            setResetTrigger((prev) => prev + 1);

            // Celebrate with confetti
            confetti({
              particleCount: 100,
              spread: 100,
              origin: { y: 0.6 },
              colors: ["#8B5CF6", "#A855F7", "#C084FC", "#DDD6FE"],
            });
          }
          // Note: Success/error toasts are handled by the wallet service
        },
        (e) => {
          // Handle payment failure through wallet service
          walletService.handlePaymentFailure(e);
          setQuote(undefined);
        },
      );
    }
  }, [quote]);
  return (
    <>
      <NumberPad onSubmit={handleSubmit} resetTrigger={resetTrigger} />
      <InvoiceModal
        invoice={quote?.request || ""}
        isOpen={!!quote?.request}
        onClose={() => {
          setQuote(undefined);
        }}
      />
    </>
  );
}

export default HomeRoute;
