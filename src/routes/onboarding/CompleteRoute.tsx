import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { configRepository } from "../../database";
import { keyService } from "../../services/KeyService";
import { nostrService } from "../../services";

function CompleteRoute() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<{
    mode: string;
    mint: string;
    relays: string[];
  } | null>(null);

  useEffect(() => {
    // Load all onboarding data
    const mnemonic = sessionStorage.getItem("onboarding_mnemonic");
    const mode = sessionStorage.getItem("onboarding_mode");
    const mint = sessionStorage.getItem("onboarding_mint");
    const relaysJson = sessionStorage.getItem("onboarding_relays");

    if (!mnemonic || !mode || !mint || !relaysJson) {
      navigate("/onboarding/welcome", { replace: true });
      return;
    }

    const relays = JSON.parse(relaysJson);
    setConfig({ mode, mint, relays });
  }, [navigate]);

  const handleComplete = async () => {
    if (!config) return;

    try {
      setSaving(true);

      // Get stored mnemonic
      const mnemonic = sessionStorage.getItem("onboarding_mnemonic");
      if (!mnemonic) {
        throw new Error("Mnemonic not found");
      }

      // Save configuration to database
      await Promise.all([
        configRepository.setMintUrl(config.mint),
        configRepository.setRelays(config.relays),
      ]);

      // Create wallet from mnemonic
      await keyService.createFromMnemonic(mnemonic);

      // Mark onboarding as complete
      await configRepository.setOnboarded(true);

      // Start Nostr service
      await nostrService.initAndStart();

      // Clear temporary onboarding data
      sessionStorage.removeItem("onboarding_mnemonic");
      sessionStorage.removeItem("onboarding_mode");
      sessionStorage.removeItem("onboarding_mint");
      sessionStorage.removeItem("onboarding_relays");

      toast.success("🎉 Welcome to PeanutPal! Your wallet is ready to use.", {
        position: "top-right",
        autoClose: 5000,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      toast.error("❌ Failed to complete setup. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!config) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-green-600 text-white">
            <h1 className="text-2xl font-bold">🎯 Ready to Launch!</h1>
            <p className="text-green-100">Review your configuration and complete setup</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-400">✅</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Configuration Summary</h3>
                  <div className="mt-2 text-sm text-green-700">
                    Your PeanutPal wallet is configured and ready to accept Lightning payments!
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">💳 Wallet Mode</h4>
                <p className="text-sm text-gray-600">
                  {config.mode === "create"
                    ? "🆕 New wallet created"
                    : "🔄 Existing wallet restored"}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">🏦 Cashu Mint</h4>
                <p className="text-sm text-gray-600 font-mono break-all">{config.mint}</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  📡 Nostr Relays ({config.relays.length})
                </h4>
                <div className="space-y-1">
                  {config.relays.map((relay, index) => (
                    <p key={index} className="text-xs text-gray-600 font-mono">
                      • {relay}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">💡</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Next Steps</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Start accepting Lightning payments immediately</li>
                      <li>Share your Nostr public key with cashiers for remote POS</li>
                      <li>Configure additional settings in the Settings page</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/onboarding/relay-config")}
                disabled={saving}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                ← Back
              </button>
              <button
                onClick={handleComplete}
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {saving ? "🚀 Setting up..." : "🚀 Complete Setup"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompleteRoute;
