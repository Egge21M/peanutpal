import type { Proof } from "@cashu/cashu-ts";
import { db, type StoredProof } from "./db";

export class ProofRepository {
  /**
   * Store new proofs in the database
   * @param proofs Array of proofs from cashu-ts
   * @param mintUrl The mint URL these proofs came from
   */
  async storeProofs(proofs: Proof[], mintUrl: string): Promise<void> {
    const storedProofs: StoredProof[] = proofs.map((proof) => ({
      ...proof,
      createdAt: Date.now(),
      isSpent: false,
      mintUrl,
    }));

    // Use bulkPut to handle potential duplicates gracefully (will update existing)
    // Since 'secret' is our primary key, this will prevent duplicate proof storage
    await db.proofs.bulkPut(storedProofs);
  }

  /**
   * Get a specific proof by its secret (primary key)
   */
  async getProofBySecret(secret: string): Promise<StoredProof | undefined> {
    return await db.proofs.get(secret);
  }

  /**
   * Get all unspent proofs
   */
  async getUnspentProofs(): Promise<StoredProof[]> {
    return await db.proofs.filter((proof) => !proof.isSpent).toArray();
  }

  /**
   * Get proofs by amount
   */
  async getProofsByAmount(amount: number): Promise<StoredProof[]> {
    return await db.proofs
      .where("amount")
      .equals(amount)
      .filter((proof) => !proof.isSpent)
      .toArray();
  }

  /**
   * Get total balance (sum of all unspent proofs)
   */
  async getTotalBalance(): Promise<number> {
    const unspentProofs = await this.getUnspentProofs();
    return unspentProofs.reduce((total, proof) => total + proof.amount, 0);
  }

  /**
   * Mark proofs as spent
   */
  async markProofsAsSpent(proofSecrets: string[]): Promise<void> {
    await db.proofs
      .where("secret")
      .anyOf(proofSecrets)
      .modify({ isSpent: true });
  }

  /**
   * Delete proofs by their secrets
   */
  async deleteProofsBySecrets(proofSecrets: string[]): Promise<void> {
    await db.proofs.bulkDelete(proofSecrets);
  }

  /**
   * Get all proofs (including spent ones)
   */
  async getAllProofs(): Promise<StoredProof[]> {
    return await db.proofs.orderBy("createdAt").reverse().toArray();
  }

  /**
   * Delete all proofs (for testing/reset purposes)
   */
  async clearAllProofs(): Promise<void> {
    await db.proofs.clear();
  }

  /**
   * Get proofs by mint URL
   */
  async getProofsByMint(mintUrl: string): Promise<StoredProof[]> {
    return await db.proofs.where("mintUrl").equals(mintUrl).toArray();
  }

  /**
   * Get spending statistics
   */
  async getStats(): Promise<{
    totalProofs: number;
    unspentProofs: number;
    spentProofs: number;
    totalBalance: number;
    totalSpent: number;
  }> {
    const allProofs = await this.getAllProofs();
    const unspentProofs = allProofs.filter((proof) => !proof.isSpent);
    const spentProofs = allProofs.filter((proof) => proof.isSpent);

    return {
      totalProofs: allProofs.length,
      unspentProofs: unspentProofs.length,
      spentProofs: spentProofs.length,
      totalBalance: unspentProofs.reduce((sum, proof) => sum + proof.amount, 0),
      totalSpent: spentProofs.reduce((sum, proof) => sum + proof.amount, 0),
    };
  }
}

// Create single instance to be used throughout the app
export const proofRepository = new ProofRepository();
