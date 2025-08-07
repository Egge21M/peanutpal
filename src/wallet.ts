import { CashuMint, CashuWallet } from "@cashu/cashu-ts";
import { configRepository } from "./database";

// Default mint URL mirrors the default seeded in ConfigRepository
const DEFAULT_MINT_URL = "https://mint.minibits.cash/Bitcoin";

// Legacy export for existing synchronous consumers
export const wallet = new CashuWallet(new CashuMint(DEFAULT_MINT_URL));

let cached: { wallet: CashuWallet; mintUrl: string } = {
  wallet,
  mintUrl: DEFAULT_MINT_URL,
};

/**
 * Returns a wallet instance paired with the currently configured mint URL.
 * If the config mint changes, a new wallet will be created and cached.
 */
export async function getWalletWithMintUrl(): Promise<{
  wallet: CashuWallet;
  mintUrl: string;
}> {
  const mintUrl = await configRepository.getMintUrl();
  if (mintUrl !== cached.mintUrl) {
    cached = {
      mintUrl,
      wallet: new CashuWallet(new CashuMint(mintUrl)),
    };
  }
  return cached;
}
