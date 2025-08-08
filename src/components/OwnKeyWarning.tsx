import useKeypair from "../hooks/useKeypair";

function OwnKeyWarning() {
  const keypair = useKeypair();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Warning Header */}
        <div className="bg-red-600 px-6 py-4 text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <h1 className="text-xl font-bold text-white">Invalid Remote Connection</h1>
        </div>

        {/* Warning Content */}
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Cannot Connect to Your Own Key
          </h2>
          <p className="text-gray-600 mb-6">
            You're trying to use your own public key as a remote POS connection. This would create a
            circular connection and is not allowed.
          </p>

          {/* Key Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Your public key:</p>
            <code className="text-xs text-gray-800 break-all font-mono">{keypair?.npub}</code>
          </div>

          {/* Instructions */}
          <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
            <h3 className="text-sm font-semibold text-purple-800 mb-2">To set up a remote POS:</h3>
            <ol className="text-purple-700 text-sm space-y-1 text-left">
              <li>1. Use a different device or browser</li>
              <li>2. Generate a new connection QR code</li>
              <li>3. Scan it with the remote device</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnKeyWarning;
