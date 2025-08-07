import QRCode from "react-qr-code";
import useKeypair from "../hooks/useKeypair";
import { useMemo } from "react";

function ConnectRoute() {
  const keypair = useKeypair();
  const connectionString = useMemo(() => {
    const url = new URL(location.href);
    url.pathname = `/remote/${keypair?.npub}`;
    return url.toString();
  }, [keypair]);

  const handleCopyConnection = async () => {
    try {
      await navigator.clipboard.writeText(connectionString);
      // You could add a toast notification here later
    } catch (err) {
      console.error("Failed to copy connection string:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Connect Remote POS
            </h1>
            <p className="text-purple-100 text-lg">
              Scan the QR code below with another device to create a remote
              point of sale
            </p>
          </div>

          <div className="px-6 py-8">
            {/* QR Code Section */}
            <div className="text-center mb-8">
              <div className="inline-block p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                <QRCode
                  value={connectionString}
                  size={200}
                  style={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "100%",
                  }}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connection String:
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <code className="text-sm text-gray-800 break-all font-mono">
                  {connectionString}
                </code>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleCopyConnection}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                📋 Copy Connection String
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectRoute;
