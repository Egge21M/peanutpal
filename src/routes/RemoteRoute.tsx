import type { MintQuoteResponse } from "@cashu/cashu-ts";
import PaymentInterface from "../components/PaymentInterface";
import { useParams } from "react-router";
import { decode } from "nostr-tools/nip19";
import { nostrService } from "../services";
import useKeypair from "../hooks/useKeypair";
import OwnKeyWarning from "../components/OwnKeyWarning";

function RemoteRoute() {
  const params = useParams();
  const keypair = useKeypair();
  const npub = params.npub as `npub1${string}`;

  // Check if the remote npub is the same as the user's own npub
  const isOwnKey = keypair?.npub === npub;

  async function remotePaymentHandler(quote: MintQuoteResponse) {
    const target = decode(npub).data;
    await nostrService.sendWrappedQuote(target, quote);
  }

  if (isOwnKey) {
    return <OwnKeyWarning />;
  }

  return <PaymentInterface onPaymentReceived={remotePaymentHandler} />;
}

export default RemoteRoute;
