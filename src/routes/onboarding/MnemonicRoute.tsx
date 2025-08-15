import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { generateNewMnemonic } from "../../keys";

function MnemonicRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") as "create" | "restore" | null;

  const [mnemonic, setMnemonic] = useState<string>("");
  const [inputMnemonic, setInputMnemonic] = useState<string>("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    // Redirect if no mode specified
    if (!mode) {
      navigate("/onboarding/welcome", { replace: true });
      return;
    }

    // Generate mnemonic for create mode
    if (mode === "create") {
      setMnemonic(generateNewMnemonic());
    }
  }, [mode, navigate]);

  const handleContinue = () => {
    const mnemonicToStore = mode === "create" ? mnemonic : inputMnemonic.trim();

    if (!mnemonicToStore) {
      return;
    }

    // Store mnemonic temporarily in sessionStorage
    sessionStorage.setItem("onboarding_mnemonic", mnemonicToStore);
    sessionStorage.setItem("onboarding_mode", mode);

    navigate("/onboarding/mint-selection");
  };

  const isValid = mode === "create" ? confirmed : inputMnemonic.trim().split(/\s+/).length >= 12;

  if (!mode) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-purple-600 text-white">
            <h1 className="text-2xl font-bold">
              {mode === "create" ? "🔑 Your Recovery Phrase" : "🔄 Restore Wallet"}
            </h1>
            <p className="text-purple-100">
              {mode === "create"
                ? "Write this down and keep it safe!"
                : "Enter your 12-word recovery phrase"}
            </p>
          </div>

          <div className="p-6">
            {mode === "create" ? (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-yellow-400">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Important Security Notice
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Write down these 12 words in order</li>
                          <li>Store them in a safe place offline</li>
                          <li>Never share them with anyone</li>
                          <li>This is the only way to recover your wallet</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Recovery Phrase
                  </label>
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 font-mono text-sm break-words">
                    {mnemonic}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="confirm-backup"
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="confirm-backup" className="ml-2 block text-sm text-gray-900">
                    I have written down my recovery phrase and stored it safely
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Your Recovery Phrase
                  </label>
                  <textarea
                    value={inputMnemonic}
                    onChange={(e) => setInputMnemonic(e.target.value)}
                    rows={4}
                    placeholder="word1 word2 word3 ... word12"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your 12-word recovery phrase, separated by spaces
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => navigate("/onboarding/welcome")}
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

export default MnemonicRoute;
