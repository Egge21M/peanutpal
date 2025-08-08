import * as bip39 from "@scure/bip39";
import * as nip06 from "nostr-tools/nip06";
import { wordlist } from "@scure/bip39/wordlists/english";
import { getPublicKey } from "nostr-tools";
import { npubEncode } from "nostr-tools/nip19";

export function generateNewMnemonic() {
  return bip39.generateMnemonic(wordlist);
}

export function deriveNostrMainKeypair(mnemonic: string) {
  const sk = nip06.privateKeyFromSeedWords(mnemonic, undefined, 0);
  const { pk, npub } = deriveNostrPublickeys(sk);
  return { sk, pk, npub };
}

export function deriveNostrChildKeypair(mnemonic: string, index: number) {
  const sk = nip06.privateKeyFromSeedWords(mnemonic, undefined, index);
  const { pk, npub } = deriveNostrPublickeys(sk);
  return { sk, pk, npub };
}

export function deriveNostrPublickeys(sk: Uint8Array) {
  const pk = getPublicKey(sk);
  const npub = npubEncode(pk);
  return { pk, npub };
}
