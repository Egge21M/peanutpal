import { useEffect, useState } from "react";
import { keyService } from "../services/KeyService";

const useKeypair = () => {
  const [key, setKey] = useState<{
    sk: Uint8Array;
    pk: string;
    npub: string;
  }>();

  useEffect(() => {
    (async () => {
      const { sk, pk, npub } = await keyService.getKeypair();
      setKey({ npub, pk, sk });
    })();
  }, []);
  return key;
};

export default useKeypair;
