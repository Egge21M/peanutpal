import { db } from "../database";
import { generateSecretKey } from "nostr-tools";
import { deriveNostrPublickeys } from "../keys";

export class KeyService {
  private static KEY_NAME = "nostr-sk" as const;

  async hasSecretKey(): Promise<boolean> {
    const existing = await db.keys.get(KeyService.KEY_NAME);
    return !!existing?.value;
  }

  async getOrCreateSecretKey(): Promise<Uint8Array> {
    const existing = await db.keys.get(KeyService.KEY_NAME);
    if (existing?.value) return existing.value;
    const sk = generateSecretKey();
    await db.keys.put({ key: KeyService.KEY_NAME, value: sk, updatedAt: Date.now() });
    return sk;
  }

  async setSecretKey(sk: Uint8Array): Promise<void> {
    await db.keys.put({ key: KeyService.KEY_NAME, value: sk, updatedAt: Date.now() });
  }

  async getKeypair(): Promise<{ sk: Uint8Array; pk: string; npub: string }> {
    const sk = await this.getOrCreateSecretKey();
    const { pk, npub } = deriveNostrPublickeys(sk);
    return { sk, pk, npub };
  }

  async createFromMnemonic(
    mnemonic: string,
  ): Promise<{ sk: Uint8Array; pk: string; npub: string }> {
    // Derive root (account 0) keypair from mnemonic and persist
    const { deriveNostrMainKeypair } = await import("../keys");
    const { sk, pk, npub } = deriveNostrMainKeypair(mnemonic);
    await this.setSecretKey(sk);
    return { sk, pk, npub };
  }
}

export const keyService = new KeyService();
