import { useState, useEffect } from "react";

interface NumberPadProps {
  onSubmit: (value: number) => void;
  resetTrigger?: number; // Increment this value to trigger a reset
}

function NumberPad({ onSubmit, resetTrigger }: NumberPadProps) {
  const [currentValue, setCurrentValue] = useState<string>("0");

  // Reset when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== undefined) {
      setCurrentValue("0");
    }
  }, [resetTrigger]);

  // Handle number button clicks
  const handleNumberClick = (digit: string) => {
    setCurrentValue((prev) => {
      if (prev === "0") {
        return digit;
      }
      return prev + digit;
    });
  };

  // Handle clear button
  const handleClear = () => {
    setCurrentValue("0");
  };

  // Handle backspace
  const handleBackspace = () => {
    setCurrentValue((prev) => {
      if (prev.length <= 1) {
        return "0";
      }
      return prev.slice(0, -1);
    });
  };

  // Handle submit
  const handleSubmit = () => {
    const numValue = parseInt(currentValue, 10);
    onSubmit(numValue);
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      event.preventDefault();

      if (event.key >= "0" && event.key <= "9") {
        handleNumberClick(event.key);
      } else if (event.key === "Enter") {
        handleSubmit();
      } else if (event.key === "Backspace") {
        handleBackspace();
      } else if (event.key === "Escape" || event.key === "Delete") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentValue]);

  // Number buttons data
  const numbers = [["7", "8", "9"], ["4", "5", "6"], ["1", "2", "3"], ["0"]];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 max-w-sm mx-auto">
      {/* Display */}
      <div className="mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-right">
          <span className="text-2xl font-mono text-gray-800">
            {currentValue}
          </span>
        </div>
      </div>

      {/* Number Grid */}
      <div className="grid gap-3 mb-4">
        {numbers.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`grid gap-3 ${
              row.length === 1 ? "grid-cols-1" : "grid-cols-3"
            }`}
          >
            {row.map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md py-3 px-4 text-xl font-semibold text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {num}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={handleBackspace}
          className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          ← Backspace
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Clear
        </button>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-md text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Submit
      </button>

      {/* Keyboard Hint */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Use keyboard: 0-9 to enter numbers, Enter to submit, Backspace to
          delete, Esc to clear
        </p>
      </div>
    </div>
  );
}

export default NumberPad;
