import { useEffect, useState } from "react";
import NumberPad from "../components/NumberPad";
import type { MintQuoteResponse } from "@cashu/cashu-ts";
import { wallet } from "../wallet";
import InvoiceModal from "../components/InvoiceModal";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";

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
          const newProofs = await wallet.mintProofs(quote.amount, quote.quote);
          console.log(newProofs);
          setQuote(undefined);

          // Reset the NumberPad input to zero
          setResetTrigger((prev) => prev + 1);

          // Celebrate with confetti
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.6 },
            colors: ["#8B5CF6", "#A855F7", "#C084FC", "#DDD6FE"],
          });

          // Show success toast
          toast.success(
            "🎉 Payment received! Invoice has been paid successfully.",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            },
          );
        },
        (e) => {
          console.error(e);
          setQuote(undefined);

          // Show error toast
          toast.error("❌ Payment failed. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
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
