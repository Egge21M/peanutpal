import { useEffect } from "react";
import QRCode from "react-qr-code";

interface InvoiceModalProps {
  invoice: string;
  isOpen: boolean;
  onClose: () => void;
}

function InvoiceModal({ invoice, isOpen, onClose }: InvoiceModalProps) {
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

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Copy invoice to clipboard
  const handleCopyInvoice = async () => {
    try {
      await navigator.clipboard.writeText(invoice);
      // You could add a toast notification here later
    } catch (err) {
      console.error("Failed to copy invoice:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Content */}
        <div className="p-6">
          {/* Payment Instructions */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Please pay this invoice
            </h3>
            <p className="text-gray-600 text-sm">
              Scan the QR code with your Lightning wallet or copy the invoice
              string
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
              <QRCode
                value={invoice}
                size={200}
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Invoice String */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice String:
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 max-h-24 overflow-y-auto">
              <code className="text-xs text-gray-800 break-all font-mono">
                {invoice}
              </code>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCopyInvoice}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              📋 Copy Invoice
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

export default InvoiceModal;
