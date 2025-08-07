import type { MintQuoteResponse } from "@cashu/cashu-ts";
import PaymentInterface from "../components/PaymentInterface";
import { useParams } from "react-router";
import { decode } from "nostr-tools/nip19";
import { generateSecretKey, nip17 } from "nostr-tools";
import { sendNostrEvent } from "../nostr";

function RemoteRoute() {
  const params = useParams();
  const npub = params.npub as `npub1${string}`;
  async function remotePaymentHandler(quote: MintQuoteResponse) {
    const randomKey = generateSecretKey();
    const target = decode(npub).data;
    const wrap = nip17.wrapEvent(
      randomKey,
      { publicKey: target },
      JSON.stringify(quote),
    );
    await sendNostrEvent(wrap);
  }
  return (
    <>
      <PaymentInterface onPaymentReceived={remotePaymentHandler} />
    </>
  );
}

export default RemoteRoute;
