import { CashuMint, CashuWallet } from "@cashu/cashu-ts";

const MINT_URL = "https://mint.minibits.cash/Bitcoin";

export const wallet = new CashuWallet(new CashuMint(MINT_URL));
export { MINT_URL };
