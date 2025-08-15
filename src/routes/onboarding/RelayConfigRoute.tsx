import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function RelayConfigRoute() {
  const navigate = useNavigate();
  const [relaysText, setRelaysText] = useState("wss://relay.damus.io");

  useEffect(() => {
    // Check if we have onboarding data
    const mnemonic = sessionStorage.getItem("onboarding_mnemonic");
    const mode = sessionStorage.getItem("onboarding_mode");
    const mint = sessionStorage.getItem("onboarding_mint");

    if (!mnemonic || !mode || !mint) {
      navigate("/onboarding/welcome", { replace: true });
    }
  }, [navigate]);

  const handleContinue = () => {
    const relays = relaysText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (relays.length === 0) {
      return;
    }

    // Store relays
    sessionStorage.setItem("onboarding_relays", JSON.stringify(relays));
    navigate("/onboarding/complete");
  };

  const relays = relaysText
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const isValid = relays.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-purple-600 text-white">
            <h1 className="text-2xl font-bold">📡 Configure Nostr Relays</h1>
            <p className="text-purple-100">Set up relays for remote POS connections</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-blue-400">ℹ️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">What are Nostr Relays?</h3>
                  <div className="mt-1 text-sm text-blue-700">
                    Nostr relays enable communication between your PeanutPal instance and remote
                    cashiers. Multiple relays provide redundancy and better connectivity.
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nostr Relays</label>
              <textarea
                value={relaysText}
                onChange={(e) => setRelaysText(e.target.value)}
                rows={6}
                placeholder="wss://relay.example.com&#10;wss://another-relay.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                One relay per line. At least one relay is required.
              </p>
            </div>

            {relays.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Configured Relays ({relays.length})
                </h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  {relays.map((relay, index) => (
                    <div key={index} className="text-xs font-mono text-gray-600 py-1">
                      ✓ {relay}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/onboarding/mint-selection")}
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

export default RelayConfigRoute;
