import Dexie, { type Table } from "dexie";
import type { Proof } from "@cashu/cashu-ts";

// Extend the Proof type to include our own metadata
export interface StoredProof extends Proof {
  createdAt: number; // Timestamp when proof was stored
  isSpent: boolean; // Track if proof has been spent
  mintUrl: string; // Which mint this proof came from
}

export class PeanutPalDB extends Dexie {
  // Define tables
  proofs!: Table<StoredProof>;

  constructor() {
    super("PeanutPalDB");

    // Version 1: Initial schema with boolean indexes (had issues)
    this.version(1).stores({
      proofs: "&secret, amount, isSpent, createdAt, mintUrl, [amount+isSpent]",
    });

    // Version 2: Removed boolean indexes to fix IndexedDB key range errors
    this.version(2).stores({
      // Define schema - using 'secret' as primary key since it's unique per proof
      // The 'id' field from Proof type is not unique, but 'secret' is guaranteed unique
      // Note: Removed isSpent from indexes as boolean values cause issues in IndexedDB
      proofs: "&secret, amount, createdAt, mintUrl",
    });
  }
}

// Create single instance to be used throughout the app
export const db = new PeanutPalDB();
