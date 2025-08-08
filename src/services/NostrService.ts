import { unwrapEvent, wrapEvent } from "nostr-tools/nip17";
import type { MintQuoteResponse } from "@cashu/cashu-ts";
import { SimplePool, type Event } from "nostr-tools";
import { walletService } from "./WalletService";
import { proofRepository } from "../database";
import { configRepository } from "../database";
import { keyService } from "./KeyService";
import { toast } from "react-toastify";

export class NostrService {
  private isListening = false;
  private pool = new SimplePool();
  private relays: string[] = [];

  /**
   * Start listening for incoming Nostr payments
   * @param publicKey The user's public key to listen for payments
   * @param secretKey The user's secret key to decrypt messages
   */
  async startListening(publicKey: string, secretKey: Uint8Array): Promise<void> {
    if (this.isListening) {
      console.log("Already listening for Nostr payments");
      return;
    }

    console.log("Starting Nostr payment listener for:", publicKey);
    this.isListening = true;
    this.relays = await configRepository.getRelays();
    this.pool.subscribe(
      this.relays,
      { kinds: [1059], "#p": [publicKey] },
      {
        onevent: async (event) => {
          try {
            // Decrypt the message
            const message = unwrapEvent(event, secretKey);

            // Parse the quote from the message
            const quote: MintQuoteResponse = JSON.parse(message.content);
            console.log("Received Nostr payment quote:", quote);

            // Check if this quote has already been processed
            const alreadyProcessed = await proofRepository.isQuoteProcessed(quote.quote);
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

            toast.error("❌ Error processing remote payment. Check console for details.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        },
      },
    );
  }

  /**
   * Stop listening for Nostr payments
   */
  stopListening(): void {
    this.isListening = false;
    console.log("Stopped listening for Nostr payments");
    // Note: SimplePool manages subscriptions internally; for a full cleanup you could maintain and close subs
  }

  /**
   * Get current listening status
   */
  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  /**
   * Initialize keys and relays and start listening based on local storage key
   */
  async initAndStart(): Promise<void> {
    const { pk, sk } = await keyService.getKeypair();
    await this.startListening(pk, sk);
  }

  /**
   * Send an event using the configured relays
   */
  async sendEvent(event: Event): Promise<void> {
    this.relays = await configRepository.getRelays();
    const pubs = this.pool.publish(this.relays, event);
    await Promise.all(pubs);
  }

  /**
   * Helper to wrap and send a MintQuoteResponse to a recipient
   */
  async sendWrappedQuote(recipientPubkey: string, quote: MintQuoteResponse): Promise<void> {
    const { generateSecretKey } = await import("nostr-tools");
    const randomKey = generateSecretKey();
    const wrapped = wrapEvent(randomKey, { publicKey: recipientPubkey }, JSON.stringify(quote));
    await this.sendEvent(wrapped);
  }
}

// Create singleton instance
export const nostrService = new NostrService();
