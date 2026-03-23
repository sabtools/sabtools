"use client";
import { useState, useMemo } from "react";

const currencies: Record<string, { name: string; symbol: string; rate: number }> = {
  INR: { name: "Indian Rupee", symbol: "\u20B9", rate: 1 },
  USD: { name: "US Dollar", symbol: "$", rate: 0.01193 },
  EUR: { name: "Euro", symbol: "\u20AC", rate: 0.01098 },
  GBP: { name: "British Pound", symbol: "\u00A3", rate: 0.00943 },
  AED: { name: "UAE Dirham", symbol: "AED", rate: 0.04382 },
  SAR: { name: "Saudi Riyal", symbol: "SAR", rate: 0.04476 },
  JPY: { name: "Japanese Yen", symbol: "\u00A5", rate: 1.793 },
  AUD: { name: "Australian Dollar", symbol: "A$", rate: 0.01841 },
  CAD: { name: "Canadian Dollar", symbol: "C$", rate: 0.01634 },
  SGD: { name: "Singapore Dollar", symbol: "S$", rate: 0.01601 },
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");

  const result = useMemo(() => {
    const v = parseFloat(amount);
    if (isNaN(v) || v < 0) return null;
    // Convert to INR first, then to target
    const inINR = v / currencies[from].rate;
    const converted = inINR * currencies[to].rate;
    return converted;
  }, [amount, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const formatNum = (n: number) => {
    if (n >= 1) return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  };

  const exchangeRate = useMemo(() => {
    const inINR = 1 / currencies[from].rate;
    return inINR * currencies[to].rate;
  }, [from, to]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="calc-input"
            min="0"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="calc-input">
            {Object.entries(currencies).map(([code, c]) => (
              <option key={code} value={code}>{code} - {c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="calc-input">
            {Object.entries(currencies).map(([code, c]) => (
              <option key={code} value={code}>{code} - {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-center">
        <button onClick={swap} className="btn-secondary">
          Swap Currencies
        </button>
      </div>

      {result !== null && amount && (
        <div className="result-card text-center">
          <div className="text-sm text-gray-500">
            {currencies[from].symbol} {formatNum(parseFloat(amount))} {from} =
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-1">
            {currencies[to].symbol} {formatNum(result)} {to}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            1 {from} = {formatNum(exchangeRate)} {to}
          </div>
        </div>
      )}

      {amount && parseFloat(amount) > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">All Conversions from {from}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(currencies)
              .filter(([code]) => code !== from)
              .map(([code, c]) => {
                const v = parseFloat(amount);
                const inINR = v / currencies[from].rate;
                const converted = inINR * c.rate;
                return (
                  <div key={code} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                    <div className="text-xs text-gray-500">{code} - {c.name}</div>
                    <div className="text-sm font-bold text-gray-800">
                      {c.symbol} {formatNum(converted)}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Disclaimer:</strong> Exchange rates are approximate and for reference only. Actual rates may vary. For real-time rates, check your bank or financial institution. Rates are based on approximate values relative to INR.
      </div>
    </div>
  );
}
