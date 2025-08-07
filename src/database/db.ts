import Dexie, { type Table } from "dexie";
import type { Proof } from "@cashu/cashu-ts";

// Extend the Proof type to include our own metadata
export interface StoredProof extends Proof {
  createdAt: number; // Timestamp when proof was stored
  isSpent: boolean; // Track if proof has been spent
  mintUrl: string; // Which mint this proof came from
}

// Interface for tracking processed quotes to prevent double-processing
export interface ProcessedQuote {
  quoteId: string; // Primary key - the quote ID from MintQuoteResponse
  processedAt: number; // Timestamp when quote was processed
  amount: number; // Amount for reference
}

export class PeanutPalDB extends Dexie {
  // Define tables
  proofs!: Table<StoredProof>;
  processedQuotes!: Table<ProcessedQuote>;

  constructor() {
    super("PeanutPalDB");

    // Version 1: Initial schema with boolean indexes (had issues)
    this.version(1).stores({
      proofs: "&secret, amount, isSpent, createdAt, mintUrl, [amount+isSpent]",
    });

    // Version 2: Removed boolean indexes to fix IndexedDB key range errors
    this.version(2).stores({
      proofs: "&secret, amount, createdAt, mintUrl",
    });

    // Version 3: Added processedQuotes table for Nostr subscription deduplication
    this.version(3).stores({
      proofs: "&secret, amount, createdAt, mintUrl",
      processedQuotes: "&quoteId, processedAt, amount",
    });
  }
}

// Create single instance to be used throughout the app
export const db = new PeanutPalDB();
