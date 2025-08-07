import { useEffect, useState } from "react";
import NumberPad from "./NumberPad";
import InvoiceModal from "./InvoiceModal";
import type { MintQuoteResponse } from "@cashu/cashu-ts";
import { getWalletWithMintUrl } from "../wallet";
import { walletService } from "../services";

interface PaymentInterfaceProps {
  onPaymentReceived: (quote: MintQuoteResponse) => void;
  resetTrigger?: number; // Optional prop to reset the NumberPad from parent
}

function PaymentInterface({
  onPaymentReceived,
  resetTrigger,
}: PaymentInterfaceProps) {
  const [quote, setQuote] = useState<MintQuoteResponse>();
  const [internalResetTrigger, setInternalResetTrigger] = useState(0);

  // Handle amount submission from NumberPad
  async function handleSubmit(amount: number) {
    try {
      const { wallet } = await getWalletWithMintUrl();
      const quote = await wallet.createMintQuote(amount);
      setQuote(quote);
    } catch (error) {
      console.error("Error creating mint quote:", error);
      walletService.handlePaymentFailure(error);
    }
  }

  // Monitor for payment when quote exists
  useEffect(() => {
    async function handleSubscription() {
      const { wallet } = await getWalletWithMintUrl();
      if (quote) {
        wallet.onMintQuotePaid(
          quote.quote,
          async () => {
            // Payment successful - notify parent
            onPaymentReceived(quote);

            // Clean up local state
            setQuote(undefined);

            // Reset NumberPad for next payment
            setInternalResetTrigger((prev) => prev + 1);
          },
          (error) => {
            // Payment failed - handle error
            walletService.handlePaymentFailure(error);
            setQuote(undefined);
          },
        );
      }
    }
    handleSubscription();
  }, [quote, onPaymentReceived]);

  // Combine internal and external reset triggers
  const combinedResetTrigger = (resetTrigger || 0) + internalResetTrigger;

  return (
    <>
      <NumberPad onSubmit={handleSubmit} resetTrigger={combinedResetTrigger} />
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

export default PaymentInterface;
