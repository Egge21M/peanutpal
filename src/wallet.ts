import { CashuMint, CashuWallet } from "@cashu/cashu-ts";
import { configRepository } from "./database";
import { keyService } from "./services/KeyService";

class WalletProvider {
  private walletCache: Record<string, CashuWallet> = {};

  /**
   * Returns a wallet instance paired with the currently configured mint URL.
   * If the config mint changes, a new wallet will be created and cached.
   */
  async getWalletWithMintUrl() {
    const seed = await keyService.getBip39Seed();
    if (!seed) {
      throw new Error("Can not instantiate wallet without seed in DB.");
    }
    const mintUrl = await configRepository.getMintUrl();
    if (this.walletCache[mintUrl]) {
      return { wallet: this.walletCache[mintUrl], mintUrl };
    }
    const newWallet = new CashuWallet(new CashuMint(mintUrl), { bip39seed: seed });
    this.walletCache[mintUrl] = newWallet;
    return { wallet: newWallet, mintUrl };
  }
}

export const walletProvider = new WalletProvider();
