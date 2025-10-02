"use client";

import { useEffect, useState, useCallback } from "react";
import { WalletClient } from "viem";

type Transaction = {
  id: string;
  type: string;
  status: string;
  userOperationHash: string;
  transactionHash: string;
  createdAt: string;
  from?: string;
  to?: string;
  value?: string;
};

type TransactionHistoryProps = {
  account: WalletClient | null;
  accountAbstraction: string;
  externallyOwnedAccount: string;
  types?: string[];
  status?: string[];
  chains?: string[];
  chainInId?: string;
  chainOutId?: string;
  userOperationHash?: string;
  transactionHash?: string;
  createdAtLatest?: string;
  createdAtOldest?: string;
  metadataKey?: string;
  metadataValue?: string;
};

export default function TransactionHistory({
  accountAbstraction,
  types = ["SWAP", "CROSS_SWAP"],
  status = ["COMPLETED", "FAILED"],
  chains = ["42161", "43114", "137"],
  chainInId,
  chainOutId,
  userOperationHash,
  transactionHash,
  createdAtLatest,
  createdAtOldest,
  metadataKey,
  metadataValue,
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    console.log("fetchHistory called for accountAbstraction:", accountAbstraction);
    if (!accountAbstraction) return;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("take", "50");

    types.forEach((t) => params.append("type", t));
    status.forEach((s) => params.append("status", s));
    chains.forEach((c) => params.append("chains", c));
    if (chainInId) params.set("chainInId", chainInId);
    if (chainOutId) params.set("chainOutId", chainOutId);
    if (userOperationHash) params.set("userOperationHash", userOperationHash);
    if (transactionHash) params.set("transactionHash", transactionHash);
    if (createdAtLatest) params.set("createdAtLatest", createdAtLatest);
    if (createdAtOldest) params.set("createdAtOldest", createdAtOldest);
    if (metadataKey) params.set("metadataKey", metadataKey);
    if (metadataValue) params.set("metadataValue", metadataValue);

    const url = `https://api.notus.team/api/v1/wallets/${accountAbstraction}/history?${params.toString()}`;

    try {
      const res = await fetch(url, {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_NOTUS_API_KEY || "your_notus_api_key",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setTransactions(data);
      } else if (data?.transactions && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Error fetching transaction history:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [accountAbstraction, types, status, chains, chainInId, chainOutId, userOperationHash, transactionHash, createdAtLatest, createdAtOldest, metadataKey, metadataValue]);

  useEffect(() => {
    console.log("TransactionHistory useEffect triggered. accountAbstraction:", accountAbstraction);
    if (accountAbstraction) {
      fetchHistory();
    }
  }, [accountAbstraction, fetchHistory]);

  const clearHistory = () => {
    setTransactions([]);
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Transaction History</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={fetchHistory}
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 bg-neon-yellow text-black border-white hover:bg-ocher-yellow"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
        <button
          onClick={clearHistory}
          className="w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 bg-red-500 text-white border-white hover:bg-red-600"
        >
          Clear History
        </button>
      </div>

      {error && <p className="text-red-500 mt-4 text-center">Error: {error}</p>}

      {loading ? (
        <p className="text-center text-white">Loading transactions...</p>
      ) : transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-graphite-gray p-4 rounded-md shadow text-white">
              <p><span className="font-medium">Type:</span> {tx.type}</p>
              <p><span className="font-medium">Status:</span> {tx.status}</p>
              <p className="break-all"><span className="font-medium">UserOp Hash:</span> {tx.userOperationHash}</p>
              <p className="break-all"><span className="font-medium">Tx Hash:</span> {tx.transactionHash}</p>
              <p><span className="font-medium">Created At:</span> {new Date(tx.createdAt).toLocaleString()}</p>
              {tx.from && <p className="break-all"><span className="font-medium">From:</span> {tx.from}</p>}
              {tx.to && <p className="break-all"><span className="font-medium">To:</span> {tx.to}</p>}
              {tx.value && <p><span className="font-medium">Value:</span> {tx.value}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white">No transactions found.</p>
      )}
    </div>
  );
}