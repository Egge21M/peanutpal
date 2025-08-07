import PaymentInterface from "../components/PaymentInterface";
import type { MintQuoteResponse } from "@cashu/cashu-ts";
import confetti from "canvas-confetti";
import { walletService } from "../services";

function HomeRoute() {
  // Handle successful payment - process proofs and celebrate
  async function handlePaymentReceived(quote: MintQuoteResponse) {
    // Process payment through wallet service (mint proofs, store in DB, show toast)
    const result = await walletService.processPaidInvoice(quote);

    if (result.success) {
      // Celebrate with confetti
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#8B5CF6", "#A855F7", "#C084FC", "#DDD6FE"],
      });
    }
    // Note: Success/error toasts are handled by the wallet service
  }

  return <PaymentInterface onPaymentReceived={handlePaymentReceived} />;
}

export default HomeRoute;
