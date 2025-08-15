import { Suspense, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ConsoleLogger, KYMHandler } from "cashu-kym";
import MintSelector from "../../components/MintSelector";

const handler = new KYMHandler({
  logger: new ConsoleLogger(),
  relays: ["wss://relay.damus.io"],
  auditorBaseUrl: "https://api.audit.8333.space/",
  timeout: 3000,
});

function MintSelectionRoute() {
  const navigate = useNavigate();
  const [selectedMint, setSelectedMint] = useState<string>("");
  const [customMint, setCustomMint] = useState<string>("");
  const [showCustom, setShowCustom] = useState(false);

  // Discover mints from Nostr
  const mintDiscovery = handler.discover();

  useEffect(() => {
    // Check if we have onboarding data
    const mnemonic = sessionStorage.getItem("onboarding_mnemonic");
    const mode = sessionStorage.getItem("onboarding_mode");

    if (!mnemonic || !mode) {
      navigate("/onboarding/welcome", { replace: true });
    }
  }, [navigate]);

  const handleContinue = () => {
    const mintUrl = showCustom ? customMint : selectedMint;

    if (!mintUrl) {
      return;
    }

    // Store selected mint
    sessionStorage.setItem("onboarding_mint", mintUrl);
    navigate("/onboarding/relay-config");
  };

  const isValid = showCustom ? customMint.trim() !== "" : selectedMint !== "";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-purple-600 text-white">
            <h1 className="text-2xl font-bold">🏦 Select a Mint</h1>
            <p className="text-purple-100">Choose a Cashu mint to manage your ecash tokens</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-blue-400">ℹ️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">What is a Mint?</h3>
                  <div className="mt-1 text-sm text-blue-700">
                    A Cashu mint converts your Bitcoin Lightning payments into anonymous ecash
                    tokens. Choose a trusted mint operator.
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle between discovered and custom */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCustom(false)}
                className={`px-4 py-2 rounded-lg border text-sm ${
                  !showCustom
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                🔍 Discovered Mints
              </button>
              <button
                onClick={() => setShowCustom(true)}
                className={`px-4 py-2 rounded-lg border text-sm ${
                  showCustom
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                ✏️ Custom Mint URL
              </button>
            </div>

            {showCustom ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mint URL</label>
                <input
                  type="url"
                  value={customMint}
                  onChange={(e) => setCustomMint(e.target.value)}
                  placeholder="https://mint.example.com/Bitcoin"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the full URL of a trusted Cashu mint
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Mints
                </label>
                <Suspense
                  fallback={
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Discovering mints...</p>
                    </div>
                  }
                >
                  <MintSelector
                    searchResult={mintDiscovery}
                    selectedMint={selectedMint}
                    onMintSelect={setSelectedMint}
                  />
                </Suspense>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() =>
                  navigate(
                    "/onboarding/mnemonic?" +
                      new URLSearchParams({
                        mode: sessionStorage.getItem("onboarding_mode") || "create",
                      }).toString(),
                  )
                }
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                ← Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!isValid}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MintSelectionRoute;
