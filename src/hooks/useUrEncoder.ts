import { useEffect, useState } from "react";
import { UR, UREncoder } from "@gandlaf21/bc-ur";

interface UseUrEncoderOptions {
  maxFragmentLength?: number;
  firstSeqNum?: number;
  intervalMs?: number;
}

/**
 * useUrEncoder
 * Given a string payload, builds a bc-ur encoder and exposes the current part and controls
 */
export default function useUrEncoder(payload: string, options?: UseUrEncoderOptions) {
  const { maxFragmentLength = 200, firstSeqNum = 0, intervalMs = 100 } = options ?? {};

  const [part, setPart] = useState<string>("");

  useEffect(() => {
    const ur = UR.from(payload);
    const encoder = new UREncoder(ur, maxFragmentLength, firstSeqNum);
    setPart(encoder.nextPart());
    const timer = window.setInterval(() => {
      setPart(encoder.nextPart());
    }, intervalMs);
    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [intervalMs, payload, maxFragmentLength, firstSeqNum]);

  return {
    part,
  };
}
