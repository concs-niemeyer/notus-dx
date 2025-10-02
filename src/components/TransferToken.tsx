"use client";

import { useState } from "react";
import { Address, WalletClient } from "viem";
import { polygon } from "viem/chains";

const USDC_POLYGON = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

const baseUrl = "https://api.notus.team/api/v1";
const apikey = process.env.NEXT_PUBLIC_NOTUS_API_KEY || "your_notus_api_key";

type TransferTokenProps = {
  account: WalletClient | null;
  accountAbstraction: string;
  externallyOwnedAccount: string;
};

export default function TransferToken({
  account,
  accountAbstraction,
  externallyOwnedAccount,
}: TransferTokenProps) {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [userOpHash, setUserOpHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTransfer = async () => {
    if (!account || !accountAbstraction || !externallyOwnedAccount) return;

    setIsLoading(true);
    setError("");
    setUserOpHash("");

    try {
      // 1. Request Transfer
      const transferParams = {
        payGasFeeToken: USDC_POLYGON,
        token: USDC_POLYGON,
        amount,
        walletAddress: accountAbstraction,
        signerAddress: externallyOwnedAccount,
        toAddress,
        chainId: polygon.id,
        gasFeePaymentMethod: "DEDUCT_FROM_AMOUNT",
      };

      console.log("Transfer params:", transferParams);

      const res = await fetch(`${baseUrl}/crypto/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apikey,
        },
        body: JSON.stringify(transferParams),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error requesting transfer:", errorText);
        setError("Failed to request transfer. Please check your inputs.");
        return;
      }

      const quoteResponse = await res.json();
      console.log("Full quote response:", quoteResponse);
      console.log("QuoteID :", quoteResponse.transfer.quoteId);

      if (!quoteResponse) {
        console.error("Error with transfer quote:", quoteResponse);
        setError("Invalid transfer quote response.");
        return;
      }

      const transferQuoteId = quoteResponse.transfer.quoteId as `0x${string}`;

      // 2. Execute Transfer
      const signature = await account.signMessage({
        account: externallyOwnedAccount as Address,
        message: { raw: transferQuoteId },
      });

      console.log("Signature:", signature);

      const execRes = await fetch(`${baseUrl}/crypto/execute-user-op`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apikey,
        },
        body: JSON.stringify({ signature, transferQuoteId }),
      });

      if (!execRes.ok) {
        const errorText = await execRes.text();
        console.error("Error executing user op:", errorText);
        setError("Failed to execute transfer.");
        return;
      }

      const execResJson = await execRes.json();
      console.log("Full exec response:", execResJson);

      const { userOpHash: hash } = execResJson;
      setUserOpHash(hash);
      console.log("UserOpHash:", hash);
      
      // Clear form on success
      setToAddress("");
      setAmount("");
    } catch (err) {
      console.error("Transfer error:", err);
      setError("An unexpected error occurred during transfer.");
    } finally {
      setIsLoading(false);
    }
  };

  const isValidAddress = toAddress.length === 42 && toAddress.startsWith("0x");
  const isValidAmount = amount && parseFloat(amount) > 0;
  const canTransfer = isValidAddress && isValidAmount && !isLoading;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8 rounded-xl shadow-2xl w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Send USDC
        </h2>
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
          USDC
        </div>
      </div>

      <div className="space-y-6">
        {/* Recipient Address Card */}
        <div className="bg-gray-800 bg-opacity-50 p-5 rounded-xl border border-gray-700 hover:border-yellow-500 transition-colors">
          <label htmlFor="toAddress" className="block text-sm font-medium text-gray-400 mb-3">
            Recipient Address
          </label>
          <div className="relative">
            <input
              id="toAddress"
              type="text"
              placeholder="0x..."
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="w-full p-4 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all font-mono text-sm"
            />
            {toAddress && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {isValidAddress ? (
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            )}
          </div>
          {toAddress && !isValidAddress && (
            <p className="text-red-400 text-xs mt-2">⚠️ Invalid address format</p>
          )}
        </div>

        {/* Amount Card */}
        <div className="bg-gray-800 bg-opacity-50 p-5 rounded-xl border border-gray-700 hover:border-yellow-500 transition-colors">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-3">
            Amount (USDC)
          </label>
          <div className="relative">
            <input
              id="amount"
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-2xl font-semibold"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
              USDC
            </span>
          </div>
        </div>

        {/* Transfer Details Info */}
        {isValidAddress && isValidAmount && (
          <div className="bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-200">
                <p className="font-semibold mb-1">Transfer Summary</p>
                <p>You're sending <span className="font-bold text-white">{amount} USDC</span> on Polygon network.</p>
                <p className="text-xs text-blue-300 mt-1">Gas fees will be deducted from the transfer amount.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Transfer Button */}
        <button
          onClick={handleTransfer}
          disabled={!canTransfer}
          className="w-full py-4 px-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Processing Transfer...
            </span>
          ) : "Send USDC"}
        </button>
      </div>

      {/* Success Message */}
      {userOpHash && (
        <div className="mt-6 bg-gradient-to-br from-green-900 to-gray-900 p-6 rounded-xl border border-green-500 shadow-xl">
          <div className="flex items-start gap-3 mb-4">
            <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold text-green-400 text-lg">Transfer Initiated Successfully!</p>
              <p className="text-gray-300 text-sm mt-1">Your transaction is being processed on the blockchain.</p>
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400 text-xs mb-2">User Operation Hash</p>
            <p className="text-white font-mono text-sm break-all">{userOpHash}</p>
          </div>
        </div>
      )}
    </div>
  );
}