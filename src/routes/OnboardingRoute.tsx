import { useEffect, useState } from "react";
import { configRepository } from "../database";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { nostrService } from "../services";
import { keyService } from "../services/KeyService";
import { generateNewMnemonic } from "../keys";

function OnboardingRoute() {
  const navigate = useNavigate();
  const [mintUrl, setMintUrl] = useState("");
  const [relaysText, setRelaysText] = useState("wss://relay.damus.io");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"create" | "restore">("create");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [restoreMnemonic, setRestoreMnemonic] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const [url, relays] = await Promise.all([
          configRepository.getMintUrl(),
          configRepository.getRelays(),
        ]);
        setMintUrl(url);
        setRelaysText(relays.join("\n"));
        // If no key exists, generate a new mnemonic to display to the user
        const hasKey = await keyService.hasSecretKey();
        if (!hasKey) {
          setMnemonic(generateNewMnemonic());
        }
      } catch (error) {
        console.error("Failed to load defaults:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleContinue = async () => {
    try {
      setSaving(true);
      const relays = relaysText
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);

      if (!mintUrl) {
        toast.error("Mint URL cannot be empty");
        return;
      }
      if (relays.length === 0) {
        toast.error("Please provide at least one relay");
        return;
      }

      await Promise.all([configRepository.setMintUrl(mintUrl), configRepository.setRelays(relays)]);

      if (mode === "restore") {
        if (!restoreMnemonic.trim()) {
          toast.error("Please enter your mnemonic to restore");
          return;
        }
        await keyService.createFromMnemonic(restoreMnemonic.trim());
      } else {
        // Ensure a key exists; if not, derive from shown mnemonic
        const hasKey = await keyService.hasSecretKey();
        if (!hasKey) {
          if (!mnemonic) {
            toast.error("Mnemonic is missing. Please reload the page.");
            return;
          }
          await keyService.createFromMnemonic(mnemonic);
        }
      }

      await configRepository.setOnboarded(true);

      // Start Nostr now that onboarding is complete
      await nostrService.initAndStart();

      toast.success("You're all set!");
      navigate("/");
    } catch (error) {
      console.error("Failed to save onboarding config:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Preparing onboarding...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-200 bg-purple-600 text-white">
            <h1 className="text-2xl font-bold">Welcome to PeanutPal</h1>
            <p className="text-purple-100">A simple POS using Cashu and Nostr</p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <p className="text-gray-700">
                PeanutPal helps you accept Lightning payments via Cashu mints. You can connect a
                remote POS using Nostr for cashier-friendly setups.
              </p>
            </div>

            {/* Mode Switch */}
            <div className="flex gap-3">
              <button
                onClick={() => setMode("create")}
                className={`px-4 py-2 rounded-md border text-sm ${
                  mode === "create"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                New Wallet
              </button>
              <button
                onClick={() => setMode("restore")}
                className={`px-4 py-2 rounded-md border text-sm ${
                  mode === "restore"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Restore Wallet
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mint URL</label>
              <input
                type="url"
                value={mintUrl}
                onChange={(e) => setMintUrl(e.target.value)}
                placeholder="https://mint.example.com/Bitcoin"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nostr Relays</label>
              <textarea
                value={relaysText}
                onChange={(e) => setRelaysText(e.target.value)}
                rows={5}
                placeholder={"wss://relay.example\nwss://another-relay"}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">One relay per line.</p>
            </div>

            {mode === "create" && mnemonic && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Recovery Phrase (Write this down!)
                </label>
                <div className="bg-purple-50 border border-purple-200 text-purple-900 rounded-md p-4 font-mono text-sm break-words">
                  {mnemonic}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This 12-word phrase can restore your wallet on any device. Keep it safe and
                  private.
                </p>
              </div>
            )}

            {mode === "restore" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Recovery Phrase
                </label>
                <textarea
                  value={restoreMnemonic}
                  onChange={(e) => setRestoreMnemonic(e.target.value)}
                  rows={3}
                  placeholder="twelve words here ..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleContinue}
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-6 py-3 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {saving ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingRoute;
