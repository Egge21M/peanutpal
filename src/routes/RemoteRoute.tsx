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

  return (
    <div className="pt-4 flex flex-col items-center gap-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Remote POS</h1>
        <p className="text-gray-600 text-xs">Creating invoices for {npub}</p>
      </div>
      <PaymentInterface onPaymentReceived={remotePaymentHandler} />
    </div>
  );
}

export default RemoteRoute;
