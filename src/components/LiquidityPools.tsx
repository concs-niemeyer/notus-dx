"use client";
import { useState } from "react";
import { Address, WalletClient } from "viem";
import { polygon } from "viem/chains";

const baseUrl = "https://api.notus.team/api/v1";
const apikey = process.env.NEXT_PUBLIC_NOTUS_API_KEY || "your_notus_api_key";

type LiquidityPoolsProps = {
  account: WalletClient | null;
  accountAbstraction: string;
  externallyOwnedAccount: string;
};

// const UNI_POLYGON = "0xb33EaAd8d922B1083446DC23f610c2567fB5180f"

const LiquidityPools = ({ account, accountAbstraction, externallyOwnedAccount }: LiquidityPoolsProps) => {
  const [token0, setToken0] = useState("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"); // USDC
  const [token1, setToken1] = useState("0xc2132D05D31c914a87C6611C10748AEb04B58e8F"); // USDT
  const [token0MaxAmount, setToken0MaxAmount] = useState("2");
  const [token1MaxAmount, setToken1MaxAmount] = useState("2");
  const [poolFeePercent, setPoolFeePercent] = useState("0.01");
  const [minPrice, setMinPrice] = useState("0.98");
  const [maxPrice, setMaxPrice] = useState("1.02");
  const [token0Amount, setToken0Amount] = useState<string | null>(null)
  const [token1Amount, setToken1Amount] = useState<string | null>(null)
  const [userOperationHash, setUserOperationHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null);


  const getTokenAmounts = async () => {
    setError(null);
    setToken0Amount(null);
    setToken1Amount(null);
    setUserOperationHash(null);

    const liquidityParams = {
      token0,
      token1,
      token0MaxAmount,
      token1MaxAmount,
      poolFeePercent,
      minPrice,
      maxPrice,
      walletAddress: accountAbstraction,
      signerAddress: externallyOwnedAccount,
      chainId: String(polygon.id),
      payGasFeeToken: token0,
      gasFeePaymentMethod: "DEDUCT_FROM_AMOUNT",
    };

    console.log("Liquidity params:", liquidityParams);

    const queryString = new URLSearchParams(liquidityParams as Record<string, string>).toString();

    try {
      const res = await fetch(`${baseUrl}/liquidity/amounts?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apikey,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error fetching token amounts:", errorText);
        setError(`Error fetching token amounts: ${errorText}`);
        return;
      }

      const resTokensAmounts = (await res.json()) 

      console.log("Tokens amounts data:",  resTokensAmounts.amounts);
    
      if (resTokensAmounts.amounts && resTokensAmounts.amounts.token0MaxAmount) {
        setToken0Amount(resTokensAmounts.amounts.token0MaxAmount.token0Amount);
        setToken1Amount(resTokensAmounts.amounts.token0MaxAmount.token1Amount);
      } else {
        setError("Unexpected response format for token amounts.");
      }
    } catch (err) {
      console.error("Network or parsing error:", err);
      setError(`Network or parsing error: ${(err as Error).message}`);
    }
  };

  const createLiquidityPosition = async () => {
    if (!token0Amount || !token1Amount) {
      setError("Token amounts not calculated.");
      return;
    }
    setError(null);

    const liquidityPositionParams = {
      walletAddress: accountAbstraction,
      toAddress: accountAbstraction, // usually same as walletAddress
      chainId: polygon.id,
      payGasFeeToken: token0,
      gasFeePaymentMethod: "DEDUCT_FROM_AMOUNT",
      token0: token0,
      token1: token1,
      poolFeePercent: poolFeePercent,
      token0Amount: token0Amount,
      token1Amount: token1Amount,
      minPrice: minPrice,
      maxPrice: maxPrice,
      slippage: "1", // 1% slippage
    };

    console.log("Create liquidity position params:", liquidityPositionParams);

    const res = await fetch(`${baseUrl}/liquidity/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apikey,
      },
      body: JSON.stringify(liquidityPositionParams),
    });

    if (!res.ok) return;

    const data = await res.json();
    console.log("Create liquidity position response:", data);
    setUserOperationHash(data.operation.userOperationHash);
  };

  const executeLiquidityTransaction = async () => {
    if (!userOperationHash || !account) return;

    const signature = await account.signMessage({
      account: externallyOwnedAccount as Address,
      message: { raw: userOperationHash as `0x${string}` },
    });

    console.log("Signature:", signature);

    const res = await fetch(`${baseUrl}/crypto/execute-user-op`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apikey,
      },
      body: JSON.stringify({
        userOperationHash,
        signature,
      }),
    });

    if (!res.ok) return;

    const data = await res.json();
    console.log("Execute user op response:", data);
    alert(`Transaction successful with hash: ${data.transactionHash}`);
    setUserOperationHash(""); // Clear hash after execution
    setToken0Amount("");
    setToken1Amount("");
  };
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8 rounded-xl shadow-2xl w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
        Liquidity Pools Management
      </h2>
      
      {/* Token Configuration Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-yellow-400">Token Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors">
            <label htmlFor="token0" className="block text-sm font-medium text-gray-300 mb-2">Token 0 Address</label>
            <input
              id="token0"
              type="text"
              value={token0}
              onChange={(e) => setToken0(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              placeholder="0x..."
            />
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors">
            <label htmlFor="token1" className="block text-sm font-medium text-gray-300 mb-2">Token 1 Address</label>
            <input
              id="token1"
              type="text"
              value={token1}
              onChange={(e) => setToken1(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              placeholder="0x..."
            />
          </div>
        </div>
      </div>

      {/* Amount Configuration Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-yellow-400">Amount Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors">
            <label htmlFor="token0MaxAmount" className="block text-sm font-medium text-gray-300 mb-2">Token 0 Max Amount</label>
            <input
              id="token0MaxAmount"
              type="text"
              value={token0MaxAmount}
              onChange={(e) => setToken0MaxAmount(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              placeholder="Amount"
            />
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors">
            <label htmlFor="token1MaxAmount" className="block text-sm font-medium text-gray-300 mb-2">Token 1 Max Amount</label>
            <input
              id="token1MaxAmount"
              type="text"
              value={token1MaxAmount}
              onChange={(e) => setToken1MaxAmount(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              placeholder="Amount"
            />
          </div>
        </div>
      </div>

      {/* Pool Settings Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-yellow-400">Pool Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors">
            <label htmlFor="poolFeePercent" className="block text-sm font-medium text-gray-300 mb-2">Pool Fee</label>
            <select
              id="poolFeePercent"
              value={poolFeePercent}
              onChange={(e) => setPoolFeePercent(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="0.01">0.01%</option>
              <option value="0.05">0.05%</option>
              <option value="0.3">0.3%</option>
              <option value="1">1%</option>
            </select>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors">
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-300 mb-2">Min Price</label>
            <input
              id="minPrice"
              type="text"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              placeholder="Min price"
            />
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors">
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-300 mb-2">Max Price</label>
            <input
              id="maxPrice"
              type="text"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              placeholder="Max price"
            />
          </div>
        </div>
      </div>

      <button
        onClick={getTokenAmounts}
        className="w-full py-4 px-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        Calculate Amounts
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-900 bg-opacity-30 border border-red-500 rounded-lg">
          <p className="text-red-400 text-center font-medium">⚠️ {error}</p>
        </div>
      )}

      {token0Amount && token1Amount && !userOperationHash && (
        <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-yellow-500 shadow-xl">
          <h4 className="text-lg font-semibold mb-4 text-yellow-400">Calculated Amounts</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Token 0 Amount</p>
              <p className="text-white font-mono text-lg">{token0Amount}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Token 1 Amount</p>
              <p className="text-white font-mono text-lg">{token1Amount}</p>
            </div>
          </div>
          <button
            onClick={createLiquidityPosition}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold text-lg rounded-lg shadow-lg hover:from-green-600 hover:to-green-800 transform hover:scale-[1.02] transition-all duration-200"
          >
            Create Liquidity Position
          </button>
        </div>
      )}

      {userOperationHash && (
        <div className="mt-8 bg-gradient-to-br from-blue-900 to-gray-900 p-6 rounded-lg border border-blue-500 shadow-xl">
          <h4 className="text-lg font-semibold mb-4 text-blue-400">Ready to Execute</h4>
          <div className="bg-gray-900 p-4 rounded-lg mb-4">
            <p className="text-gray-400 text-sm mb-2">User Operation Hash</p>
            <p className="text-white font-mono text-sm break-all">{userOperationHash}</p>
          </div>
          <button
            onClick={executeLiquidityTransaction}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-lg rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200"
          >
            Execute Transaction
          </button>
        </div>
      )}
    </div>
  );
}

export default LiquidityPools;