import { useEffect, useState } from "react";
import { walletService } from "../services";

function WalletRoute() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalProofs: 0,
    unspentProofs: 0,
    spentProofs: 0,
    totalBalance: 0,
    totalSpent: 0,
  });

  // Load wallet data on component mount
  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [currentBalance, walletStats] = await Promise.all([
        walletService.getBalance(),
        walletService.getWalletStats(),
      ]);

      setBalance(currentBalance);
      setStats(walletStats);
    } catch (error) {
      console.error("Error loading wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = () => {
    // TODO: Implement withdraw functionality
    console.log("Withdraw button clicked - functionality to be implemented");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading wallet...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet</h1>
          <p className="text-gray-600">
            Manage your Cashu wallet balance and transactions
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-purple-600 px-6 py-8 text-center">
            <h2 className="text-lg font-medium text-purple-100 mb-2">
              Current Balance
            </h2>
            <div className="text-4xl font-bold text-white mb-4">
              {balance.toLocaleString()}{" "}
              <span className="text-2xl font-normal">sats</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleWithdraw}
                className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
              >
                💸 Withdraw
              </button>
              <button
                onClick={loadWalletData}
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {stats.totalProofs}
            </div>
            <div className="text-sm text-gray-600">Total Proofs</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {stats.unspentProofs}
            </div>
            <div className="text-sm text-gray-600">Unspent Proofs</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {stats.spentProofs}
            </div>
            <div className="text-sm text-gray-600">Spent Proofs</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-gray-700 mb-2">
              {stats.totalSpent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Spent (sats)</div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Wallet Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  About Your Wallet
                </h4>
                <p className="text-gray-600 text-sm">
                  Your PeanutPal wallet stores Cashu proofs locally in your
                  browser. These proofs represent Bitcoin Lightning sats that
                  you can spend or withdraw.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Security Note
                </h4>
                <p className="text-gray-600 text-sm">
                  Your proofs are stored locally in your browser's database.
                  Make sure to keep your browser data backed up to avoid losing
                  funds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletRoute;
