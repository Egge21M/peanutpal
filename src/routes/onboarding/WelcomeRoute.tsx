import { useNavigate } from "react-router";

function WelcomeRoute() {
  const navigate = useNavigate();

  const handleModeSelection = (mode: "create" | "restore") => {
    navigate(`/onboarding/mnemonic?mode=${mode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-200 bg-purple-600 text-white text-center">
            <h1 className="text-3xl font-bold">Welcome to PeanutPal</h1>
            <p className="text-purple-100 mt-2">A simple POS using Cashu and Nostr</p>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-gray-700">
                PeanutPal helps you accept Lightning payments via Cashu mints. You can connect a
                remote POS using Nostr for cashier-friendly setups.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleModeSelection("create")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                🆕 Create New Wallet
                <p className="text-sm text-purple-100 mt-1">Generate a new recovery phrase</p>
              </button>

              <button
                onClick={() => handleModeSelection("restore")}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-6 py-4 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                🔄 Restore Existing Wallet
                <p className="text-sm text-gray-500 mt-1">Use your existing recovery phrase</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeRoute;
