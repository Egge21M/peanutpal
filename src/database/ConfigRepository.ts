import { db, type AppConfig } from "./db";

export const CONFIG_KEYS = {
  MINT_URL: "MINT_URL",
  RELAYS: "RELAYS",
  ONBOARDED: "ONBOARDED",
} as const;

const DEFAULTS = {
  [CONFIG_KEYS.MINT_URL]: "https://nofees.testnut.cashu.space",
  [CONFIG_KEYS.RELAYS]: JSON.stringify(["wss://relay.damus.io"]),
} as const;

export class ConfigRepository {
  async get(key: string): Promise<string | undefined> {
    const record = await db.config.get(key);
    return record?.value;
  }

  async set(key: string, value: string): Promise<void> {
    const configRecord: AppConfig = {
      key,
      value,
      updatedAt: Date.now(),
    };
    await db.config.put(configRecord);
  }

  async delete(key: string): Promise<void> {
    await db.config.delete(key);
  }

  async getAll(): Promise<AppConfig[]> {
    return db.config.orderBy("updatedAt").reverse().toArray();
  }

  // Convenience helpers for known keys
  async getMintUrl(): Promise<string> {
    const existing = await db.config.get(CONFIG_KEYS.MINT_URL);
    if (!existing) {
      const def = DEFAULTS[CONFIG_KEYS.MINT_URL];
      await this.set(CONFIG_KEYS.MINT_URL, def);
      return def;
    }
    return existing.value;
  }

  async setMintUrl(url: string): Promise<void> {
    await this.set(CONFIG_KEYS.MINT_URL, url);
  }

  async getRelays(): Promise<string[]> {
    const existing = await db.config.get(CONFIG_KEYS.RELAYS);
    if (!existing) {
      const def = DEFAULTS[CONFIG_KEYS.RELAYS];
      await this.set(CONFIG_KEYS.RELAYS, def);
      return JSON.parse(def);
    }
    try {
      return JSON.parse(existing.value);
    } catch {
      const def = DEFAULTS[CONFIG_KEYS.RELAYS];
      await this.set(CONFIG_KEYS.RELAYS, def);
      return JSON.parse(def);
    }
  }

  async setRelays(relays: string[]): Promise<void> {
    await this.set(CONFIG_KEYS.RELAYS, JSON.stringify(relays));
  }

  async isOnboarded(): Promise<boolean> {
    const value = await this.get(CONFIG_KEYS.ONBOARDED);
    return value === "true";
  }

  async setOnboarded(done: boolean): Promise<void> {
    await this.set(CONFIG_KEYS.ONBOARDED, done ? "true" : "false");
  }
}

export const configRepository = new ConfigRepository();
