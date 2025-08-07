import { toast } from "react-toastify";
import { wallet, MINT_URL } from "../wallet";
import { proofRepository } from "../database";
import type { MintQuoteResponse, Proof } from "@cashu/cashu-ts";

export interface PaymentResult {
  success: boolean;
  balance: number;
  proofs?: Proof[];
  error?: string;
}

export class WalletService {
  /**
   * Process a paid invoice by minting proofs and storing them
   * @param quote The mint quote response from the paid invoice
   * @returns Promise with payment result including success status and new balance
   */
  async processPaidInvoice(quote: MintQuoteResponse): Promise<PaymentResult> {
    try {
      console.log("Processing paid invoice for amount:", quote.amount);

      // Mint proofs from the wallet
      const newProofs = await wallet.mintProofs(quote.amount, quote.quote);
      console.log("Minted proofs:", newProofs);

      // Store proofs in database
      await proofRepository.storeProofs(newProofs, MINT_URL);
      console.log("Proofs stored successfully");

      // Get updated balance
      const balance = await proofRepository.getTotalBalance();
      console.log("Total balance:", balance);

      // Show success toast
      toast.success("🎉 Payment received! Proofs stored successfully.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      return {
        success: true,
        balance,
        proofs: newProofs,
      };
    } catch (error) {
      console.error("Error processing payment:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      // Show error toast
      toast.error(
        "❌ Error storing payment proofs. Please check the console.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      );

      return {
        success: false,
        balance: await this.getBalance(), // Get current balance even on error
        error: errorMessage,
      };
    }
  }

  /**
   * Handle payment failure
   * @param error The error that occurred during payment
   */
  handlePaymentFailure(error: unknown): void {
    console.error("Payment failed:", error);

    toast.error("❌ Payment failed. Please try again.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  /**
   * Get current wallet balance
   * @returns Promise with current balance in sats
   */
  async getBalance(): Promise<number> {
    try {
      return await proofRepository.getTotalBalance();
    } catch (error) {
      console.error("Error getting balance:", error);
      return 0;
    }
  }

  /**
   * Get wallet statistics
   * @returns Promise with comprehensive wallet stats
   */
  async getWalletStats() {
    try {
      return await proofRepository.getStats();
    } catch (error) {
      console.error("Error getting wallet stats:", error);
      return {
        totalProofs: 0,
        unspentProofs: 0,
        spentProofs: 0,
        totalBalance: 0,
        totalSpent: 0,
      };
    }
  }

  /**
   * Get all unspent proofs
   * @returns Promise with array of unspent proofs
   */
  async getUnspentProofs() {
    try {
      return await proofRepository.getUnspentProofs();
    } catch (error) {
      console.error("Error getting unspent proofs:", error);
      return [];
    }
  }
}

// Create singleton instance
export const walletService = new WalletService();
