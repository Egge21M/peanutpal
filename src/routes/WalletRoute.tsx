import { useEffect, useMemo, useState } from "react";
import { walletService } from "../services";
import { historyRepository, type HistoryEvent } from "../database";
import { appEvents } from "../services/EventBus";

function WalletRoute() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  // Load wallet data on component mount
  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [currentBalance, pageData] = await Promise.all([
        walletService.getBalance(),
        historyRepository.getPaginated(page, pageSize),
      ]);

      setBalance(currentBalance);
      setEvents(pageData.events);
      setTotal(pageData.total);
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

  useEffect(() => {
    loadWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const handler = () => {
      // Refresh current page and balance when wallet changes
      loadWalletData();
    };
    appEvents.addEventListener("wallet:updated", handler as EventListener);
    return () => appEvents.removeEventListener("wallet:updated", handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

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
          <p className="text-gray-600">Manage your Cashu wallet balance and transactions</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-purple-600 px-6 py-8 text-center">
            <h2 className="text-lg font-medium text-purple-100 mb-2">Current Balance</h2>
            <div className="text-4xl font-bold text-white mb-4">
              {balance.toLocaleString()} <span className="text-2xl font-normal">sats</span>
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

        {/* Events List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">History</h3>
            <div className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </div>
          </div>
          <div className="divide-y">
            {events.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No events yet.</div>
            ) : (
              events.map((evt) => {
                let typeColor = "text-gray-700";
                if (evt.type === "direct-payment") typeColor = "text-green-600";
                if (evt.type === "remote-payment") typeColor = "text-purple-600";
                if (evt.type === "withdrawal") typeColor = "text-red-600";
                return (
                  <div key={evt.id} className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className={`font-semibold ${typeColor}`}>{evt.type}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(evt.createdAt).toLocaleString()}
                      </div>
                      {evt.mintUrl && (
                        <div className="text-xs text-gray-500 break-all">{evt.mintUrl}</div>
                      )}
                      {evt.quoteId && (
                        <div className="text-xs text-gray-500 break-all">quote: {evt.quoteId}</div>
                      )}
                      {evt.metadata && (
                        <pre className="mt-2 bg-gray-50 border border-gray-200 rounded-md p-2 text-xs text-gray-700 max-w-full overflow-x-auto">
                          {(() => {
                            try {
                              return JSON.stringify(JSON.parse(evt.metadata), null, 2);
                            } catch {
                              return evt.metadata;
                            }
                          })()}
                        </pre>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {evt.type === "withdrawal" ? "-" : "+"}
                        {evt.amount.toLocaleString()}{" "}
                        <span className="text-sm font-normal">sats</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>
            <div className="text-sm text-gray-600">
              {events.length} of {total} events
            </div>
            <button
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletRoute;
