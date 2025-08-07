import { getPublicKey } from "nostr-tools";
import { decode, npubEncode } from "nostr-tools/nip19";
import { useEffect, useState } from "react";

const useKeypair = () => {
  const [key, setKey] = useState<{
    sk: Uint8Array;
    pk: string;
    npub: string;
  }>();

  useEffect(() => {
    const storedKey = localStorage.getItem("peanut-key") as `nsec1${string}`;
    const { data: sk } = decode(storedKey);
    const pk = getPublicKey(sk);
    const npub = npubEncode(pk);
    setKey({ npub, pk, sk });
  }, []);
  return key;
};

export default useKeypair;
