import { useEffect } from "react";
import QRCode from "react-qr-code";
import useUrEncoder from "../hooks/useUrEncoder";

interface TokenQrModalProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
}

function TokenQrModal({ token, isOpen, onClose }: TokenQrModalProps) {
  const { part } = useUrEncoder(token, { maxFragmentLength: 200, firstSeqNum: 0, intervalMs: 100 });

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
    } catch (err) {
      console.error("Failed to copy token:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Scan to withdraw</h3>
            <p className="text-gray-600 text-sm">
              Animated QR code containing your Cashu token. Use a compatible wallet to redeem.
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
              <QRCode
                value={part || ""}
                size={240}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCopy}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              📋 Copy Token
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenQrModal;
