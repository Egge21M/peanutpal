import { useCallback, useEffect, useRef, useState } from "react";
import { UR, UREncoder } from "@gandlaf21/bc-ur";

interface UseUrEncoderOptions {
  maxFragmentLength?: number; // defaults to 200 (good for most QR scanners)
  firstSeqNum?: number; // defaults to 0
  intervalMs?: number; // rotation interval, defaults to 100ms
}

/**
 * useUrEncoder
 * Given a string payload, builds a bc-ur encoder and exposes the current part and controls
 */
export default function useUrEncoder(payload: string, options?: UseUrEncoderOptions) {
  const { maxFragmentLength = 200, firstSeqNum = 0, intervalMs = 100 } = options ?? {};

  const encoderRef = useRef<UREncoder | null>(null);
  const [part, setPart] = useState<string>("");
  const timerRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (!payload) {
      encoderRef.current = null;
      setPart("");
      return;
    }
    const bytes = new TextEncoder().encode(payload);
    // UR.fromBuffer accepts a byte buffer; TextEncoder provides Uint8Array
    const ur = UR.fromBuffer(bytes as unknown as Buffer);
    encoderRef.current = new UREncoder(ur, maxFragmentLength, firstSeqNum);
    // Seed first part for immediate display
    setPart(encoderRef.current.nextPart());
  }, [payload, maxFragmentLength, firstSeqNum]);

  const next = useCallback(() => {
    if (!encoderRef.current) return "";
    const p = encoderRef.current.nextPart();
    setPart(p);
    return p;
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    // Always auto-rotate parts every intervalMs
    if (!encoderRef.current) return;
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = window.setInterval(() => {
      next();
    }, intervalMs);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [intervalMs, next, payload, maxFragmentLength, firstSeqNum]);

  return {
    part, // current UR part string, e.g., "ur:bytes/1-9/..."
    // next and reset are left available but not required by consumers
    next,
    reset,
  };
}
