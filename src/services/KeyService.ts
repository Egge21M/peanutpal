import { db } from "../database";
import { generateSecretKey } from "nostr-tools";
import { deriveNostrPublickeys, deriveBip39Seed } from "../keys";

export class KeyService {
  private static KEY_NAME = "nostr-sk" as const;
  private static MNEMONIC_KEY = "mnemonic" as const;
  private static BIP39_SEED_KEY = "bip39-seed" as const;

  async hasSecretKey(): Promise<boolean> {
    const existing = await db.keys.get(KeyService.KEY_NAME);
    return !!existing?.value;
  }

  async getOrCreateSecretKey(): Promise<Uint8Array> {
    const existing = await db.keys.get(KeyService.KEY_NAME);
    if (existing?.value && existing.value instanceof Uint8Array) return existing.value;
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
    // Persist mnemonic and bip39 seed bytes
    await db.keys.put({ key: KeyService.MNEMONIC_KEY, value: mnemonic, updatedAt: Date.now() });
    const seed = await deriveBip39Seed(mnemonic);
    await db.keys.put({
      key: KeyService.BIP39_SEED_KEY,
      value: new Uint8Array(seed),
      updatedAt: Date.now(),
    });
    return { sk, pk, npub };
  }

  async getMnemonic(): Promise<string | undefined> {
    const rec = await db.keys.get(KeyService.MNEMONIC_KEY);
    return typeof rec?.value === "string" ? rec.value : undefined;
  }

  async getBip39Seed(): Promise<Uint8Array | undefined> {
    const rec = await db.keys.get(KeyService.BIP39_SEED_KEY);
    return rec?.value instanceof Uint8Array ? rec.value : undefined;
  }
}

export const keyService = new KeyService();
