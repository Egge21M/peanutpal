import { CashuMint, CashuWallet } from "@cashu/cashu-ts";

const MINT_URL = "https://nofees.testnut.cashu.space";

export const wallet = new CashuWallet(new CashuMint(MINT_URL));
