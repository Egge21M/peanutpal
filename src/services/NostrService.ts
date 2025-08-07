import { unwrapEvent } from "nostr-tools/nip17";
import type { MintQuoteResponse } from "@cashu/cashu-ts";
import { listenForPayments } from "../nostr";
import { walletService } from "./WalletService";
import { proofRepository } from "../database";
import { toast } from "react-toastify";

export class NostrService {
  private isListening = false;

  /**
   * Start listening for incoming Nostr payments
   * @param publicKey The user's public key to listen for payments
   * @param secretKey The user's secret key to decrypt messages
   */
  async startListening(
    publicKey: string,
    secretKey: Uint8Array,
  ): Promise<void> {
    if (this.isListening) {
      console.log("Already listening for Nostr payments");
      return;
    }

    console.log("Starting Nostr payment listener for:", publicKey);
    this.isListening = true;

    listenForPayments(publicKey, async (event) => {
      try {
        // Decrypt the message
        const message = unwrapEvent(event, secretKey);

        // Parse the quote from the message
        const quote: MintQuoteResponse = JSON.parse(message.content);
        console.log("Received Nostr payment quote:", quote);

        // Check if this quote has already been processed
        const alreadyProcessed = await proofRepository.isQuoteProcessed(
          quote.quote,
        );
        if (alreadyProcessed) {
          console.log("Quote already processed, skipping:", quote.quote);
          return;
        }

        // Mark quote as processed before processing to prevent race conditions
        await proofRepository.markQuoteAsProcessed(quote.quote, quote.amount);

        // Process the payment through wallet service
        console.log("Processing remote payment:", quote.amount, "sats");
        const result = await walletService.processPaidInvoice(quote, "remote");

        if (!result.success) {
          console.error("Failed to process remote payment:", result.error);
          // The wallet service already shows error toasts, but we could add remote-specific messaging here
        }
      } catch (error) {
        console.error("Error processing Nostr payment:", error);

        toast.error(
          "❌ Error processing remote payment. Check console for details.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          },
        );
      }
    });
  }

  /**
   * Stop listening for Nostr payments
   */
  stopListening(): void {
    this.isListening = false;
    console.log("Stopped listening for Nostr payments");
    // Note: The actual nostr subscription cleanup would depend on the implementation
    // of listenForPayments function which we don't have control over here
  }

  /**
   * Get current listening status
   */
  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  /**
   * Cleanup old processed quotes (call this periodically)
   */
  async performMaintenance(): Promise<void> {
    try {
      const deletedCount = await proofRepository.cleanupOldProcessedQuotes();
      if (deletedCount > 0) {
        console.log(`Cleaned up ${deletedCount} old processed quotes`);
      }
    } catch (error) {
      console.error("Error during Nostr service maintenance:", error);
    }
  }
}

// Create singleton instance
export const nostrService = new NostrService();
