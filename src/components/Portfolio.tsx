"use client";

import { useState } from "react";

interface PortfolioProps {
  accountAbstraction: string;
}

interface Token {
  address: string;
  name: string;
  symbol: string;
  balanceFormatted: string;
  balanceUsd: string;
}

export default function Portfolio({ accountAbstraction}: PortfolioProps) {
  const [portfolio, setPortfolio] = useState<{ tokens: Token[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPortfolio = async () => {
    if (!accountAbstraction) return;
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.notus.team/api/v1/wallets/${accountAbstraction}/portfolio`, {
        method: "GET",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_NOTUS_API_KEY || "your_notus_api_key",
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch portfolio");
      }

      const data = await res.json();
      setPortfolio(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalValue = portfolio?.tokens.reduce((acc, token) => {
    return acc + parseFloat(token.balanceUsd || "0");
  }, 0);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8 rounded-xl shadow-2xl w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          My Portfolio
        </h2>
        {portfolio && totalValue !== undefined && (
          <div className="text-right">
            <p className="text-sm text-gray-400">Total Value</p>
            <p className="text-2xl font-bold text-green-400">
              ${totalValue.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={getPortfolio}
        className="w-full py-4 px-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-8"
        disabled={isLoading || !accountAbstraction}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Loading Portfolio...
          </span>
        ) : "Load Portfolio"}
      </button>

      {portfolio && portfolio.tokens.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-yellow-400">Assets</h3>
            <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
              {portfolio.tokens.length} {portfolio.tokens.length === 1 ? 'Token' : 'Tokens'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.tokens.map((token) => {
              const tokenValue = parseFloat(token.balanceUsd || "0");
              const percentage = totalValue ? (tokenValue / totalValue) * 100 : 0;
              
              return (
                <div 
                  key={token.address} 
                  className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-lg border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 group"
                >
                  {/* Header with Symbol and Name */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center font-bold text-black text-sm">
                        {token.symbol.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors">
                          {token.symbol}
                        </h4>
                        <p className="text-xs text-gray-400">{token.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Balance Information */}
                  <div className="space-y-3">
                    <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Balance</p>
                      <p className="text-xl font-bold text-white">
                        {parseFloat(token.balanceFormatted).toLocaleString('en-US', {
                          maximumFractionDigits: 6
                        })}
                      </p>
                    </div>

                    <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">USD Value</p>
                      <p className="text-lg font-semibold text-green-400">
                        ${parseFloat(token.balanceUsd).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>

                    {/* Percentage Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">Portfolio %</span>
                        <span className="text-xs font-semibold text-yellow-400">
                          {percentage.toFixed(2)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Contract Address */}
                    <div className="pt-2 border-t border-gray-700">
                      <p className="text-xs text-gray-500 mb-1">Contract</p>
                      <p className="text-xs font-mono text-gray-400 truncate">
                        {token.address}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {portfolio && portfolio.tokens.length === 0 && (
        <div className="text-center py-12 bg-gray-800 bg-opacity-30 rounded-lg border border-gray-700">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-400 text-lg">No tokens found in this portfolio</p>
          <p className="text-gray-500 text-sm mt-2">Try adding some assets to get started</p>
        </div>
      )}
    </div>
  );
}