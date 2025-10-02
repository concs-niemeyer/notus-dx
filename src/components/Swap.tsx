"use client";

import { useState } from "react";
import { Address, WalletClient } from "viem";
import { polygon } from "viem/chains";

export type SwapQuote = {
  quotes: {
    quoteId?: string;
    expiresAt: number;
    amountIn: string;
    chainIdIn: number;
    chainIdOut: number;
    estimatedFees: {
      maxGasFeeToken: string;
      maxGasFeeNative: string;
    };
    minAmountOut: string;
    tokenIn: string;
    tokenOut: string;
    walletAddress: string;
    chain: string;
  }[];
};

const UNI_POLYGON = "0xb33EaAd8d922B1083446DC23f610c2567fB5180f";
const USDC_POLYGON = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const USDT_POLYGON = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const BRZ_POLYGON = "0x4eD141110F6EeeAbA9A1df36d8c26f684d2475Dc";

const tokenOptions = [
  { value: UNI_POLYGON, label: "UNI", color: "from-pink-500 to-pink-700" },
  { value: USDC_POLYGON, label: "USDC", color: "from-blue-500 to-blue-700" },
  { value: USDT_POLYGON, label: "USDT", color: "from-green-500 to-green-700" },
  { value: BRZ_POLYGON, label: "BRZ", color: "from-yellow-500 to-yellow-700" },
];

const baseUrl = "https://api.notus.team/api/v1";
const apikey = process.env.NEXT_PUBLIC_NOTUS_API_KEY || "your_notus_api_key";

type SwapProps = {
  account: WalletClient | null;
  accountAbstraction: string;
  externallyOwnedAccount: string;
};

function QuoteView({ quote, onSign }: { quote: SwapQuote; onSign: () => void }) {
  const formatAmount = (amount: string) => {
    return parseFloat(amount).toLocaleString('en-US', {
      maximumFractionDigits: 6
    });
  };

  const getTokenLabel = (address: string) => {
    return tokenOptions.find(t => t.value.toLowerCase() === address.toLowerCase())?.label || 'Unknown';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-green-500 shadow-xl mt-6">
      <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
        <span className="text-2xl">✓</span> Swap Quote Ready
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-400 text-xs mb-1">You Send</p>
          <p className="text-white font-mono text-lg font-semibold">
            {formatAmount(quote.quotes[0].amountIn)}
          </p>
          <p className="text-green-400 text-sm mt-1">{getTokenLabel(quote.quotes[0].tokenIn)}</p>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-400 text-xs mb-1">You Receive (Min)</p>
          <p className="text-white font-mono text-lg font-semibold">
            {formatAmount(quote.quotes[0].minAmountOut)}
          </p>
          <p className="text-green-400 text-sm mt-1">{getTokenLabel(quote.quotes[0].tokenOut)}</p>
        </div>
      </div>

      <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg mb-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Max Gas Fee (Token)</span>
          <span className="text-white text-sm font-mono">{quote.quotes[0].estimatedFees.maxGasFeeToken}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Max Gas Fee (Native)</span>
          <span className="text-white text-sm font-mono">{quote.quotes[0].estimatedFees.maxGasFeeNative}</span>
        </div>
        <div className="pt-2 border-t border-gray-700">
          <p className="text-gray-500 text-xs mb-1">Quote ID</p>
          <p className="text-gray-400 text-xs font-mono truncate">{quote.quotes[0].quoteId}</p>
        </div>
      </div>

      <button
        onClick={onSign}
        className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold text-lg rounded-lg shadow-lg hover:from-green-600 hover:to-green-800 transform hover:scale-[1.02] transition-all duration-200"
      >
        Sign & Execute Swap
      </button>
    </div>
  );
}

export default function Swap({ account, accountAbstraction, externallyOwnedAccount }: SwapProps) {
  const [fromToken, setFromToken] = useState(USDC_POLYGON);
  const [toToken, setToToken] = useState(UNI_POLYGON);
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<SwapQuote | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const getSwapQuote = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsLoading(true);
    try {
      const swapParams = {
        payGasFeeToken: fromToken,
        tokenIn: fromToken,
        tokenOut: toToken,
        amountIn: amount,
        walletAddress: accountAbstraction,
        toAddress: accountAbstraction,
        signerAddress: externallyOwnedAccount,
        chainIdIn: polygon.id,
        chainIdOut: polygon.id,
        gasFeePaymentMethod: "DEDUCT_FROM_AMOUNT",
      };
      console.log("Swap params:", swapParams);

      const res = await fetch(`${baseUrl}/crypto/swap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apikey,
        },
        body: JSON.stringify(swapParams),
      });

      if (!res.ok) return;

      const data = (await res.json()) as SwapQuote;

      console.log("Swap quote data:", { data });

      setQuote(data);
    } finally {
      setIsLoading(false);
    }
  };

  const signingAndExecute = async () => {
    if (!quote?.quotes[0]?.quoteId) return;
    const quoteId = quote.quotes[0].quoteId as `0x${string}`;

    if (!account) return;
    
    try {
      const signature = await account.signMessage({
        account: externallyOwnedAccount as Address,
        message: { raw: quoteId },
      });

      console.log("Signature:", signature);

      const res = await fetch(`${baseUrl}/crypto/execute-user-op`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apikey,
        },
        body: JSON.stringify({
          quoteId,
          signature,
        }),
      });

      if (!res.ok) return;

      const data = await res.json();

      console.log("Execute user op response:", data.userOpHash);
      alert(`Swap executed successfully! Hash: ${data.userOpHash}`);
      
      // Reset form
      setQuote(undefined);
      setAmount("");
    } catch (error) {
      console.error("Error executing swap:", error);
    }
  };

  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const getTokenInfo = (address: string) => {
    return tokenOptions.find(t => t.value === address) || tokenOptions[0];
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8 rounded-xl shadow-2xl w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
        Token Swap
      </h2>

      <div className="space-y-4">
        {/* From Token Section */}
        <div className="bg-gray-800 bg-opacity-50 p-5 rounded-lg border border-gray-700">
          <label htmlFor="fromToken" className="block text-sm font-medium text-gray-300 mb-3">
            From
          </label>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${getTokenInfo(fromToken).color} rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg`}>
              {getTokenInfo(fromToken).label.substring(0, 2)}
            </div>
            <select
              id="fromToken"
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="flex-1 p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all cursor-pointer"
            >
              {tokenOptions.map(token => (
                <option key={token.value} value={token.value}>{token.label}</option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <input
              id="amount"
              type="text"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-2xl font-semibold placeholder-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={swapTokens}
            className="bg-gray-800 border-4 border-gray-900 p-3 rounded-full hover:bg-gray-700 transition-all duration-200 transform hover:rotate-180"
          >
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Token Section */}
        <div className="bg-gray-800 bg-opacity-50 p-5 rounded-lg border border-gray-700">
          <label htmlFor="toToken" className="block text-sm font-medium text-gray-300 mb-3">
            To
          </label>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${getTokenInfo(toToken).color} rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg`}>
              {getTokenInfo(toToken).label.substring(0, 2)}
            </div>
            <select
              id="toToken"
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="flex-1 p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all cursor-pointer"
            >
              {tokenOptions.map(token => (
                <option key={token.value} value={token.value}>{token.label}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 p-3 bg-gray-900 rounded-lg">
            <p className="text-gray-500 text-sm">You&apos;ll receive</p>
            <p className="text-2xl font-semibold text-gray-400">-</p>
          </div>
        </div>

        <button
          onClick={getSwapQuote}
          disabled={isLoading || !amount || parseFloat(amount) <= 0}
          className="w-full py-4 px-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Getting Quote...
            </span>
          ) : "Get Quote"}
        </button>
      </div>

      {quote && <QuoteView quote={quote} onSign={signingAndExecute} />}
    </div>
  );
}