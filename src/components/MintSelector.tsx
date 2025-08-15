import { use, useState } from "react";
import { ConsoleLogger, KYMHandler } from "cashu-kym";

type MintSelectorProps = {
  searchResult: ReturnType<KYMHandler["discover"]>;
  selectedMint?: string;
  onMintSelect?: (mint: string) => void;
};

function MintSelector({ searchResult, selectedMint, onMintSelect }: MintSelectorProps) {
  const discoveryResult = use(searchResult);
  const [queryResult, setQueryResult] = useState(discoveryResult.results);

  if (queryResult.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No mints discovered. Try using a custom mint URL instead.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {queryResult.map((mint, index) => (
        <button
          key={index}
          onClick={() => onMintSelect?.(mint.url)}
          className={`w-full text-left p-3 rounded-lg border transition-colors ${
            selectedMint === mint.url
              ? "border-purple-500 bg-purple-50 text-purple-900"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="font-medium text-sm">{mint.url}</div>
          {mint.description && <div className="text-xs text-gray-500 mt-1">{mint.description}</div>}
        </button>
      ))}
    </div>
  );
}

export default MintSelector;
