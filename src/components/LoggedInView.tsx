
'use client';

import { WalletClient } from "viem";
import LiquidityPools from "./LiquidityPools";
import Portfolio from "./Portfolio";
import Swap from "./Swap";
import TransferToken from "./TransferToken";
// import TransactionHistory from "./TransactionHistory";

interface LoggedInViewProps {
  logout: () => void;
  account: WalletClient | null;
  accountAbstraction: string;
  externallyOwnedAccount: string;
}

export default function LoggedInView({ logout, account, accountAbstraction, externallyOwnedAccount }: LoggedInViewProps) {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-center space-y-2 text-sm">
        {externallyOwnedAccount && (
          <div className="bg-graphite-gray p-2 rounded-md w-full text-center break-all text-white">
            <span className="font-semibold">Signer:</span> {externallyOwnedAccount}
          </div>
        )}

        {accountAbstraction && (
          <div className="bg-graphite-gray p-2 rounded-md w-full text-center break-all text-white">
            <span className="font-semibold">Account Abstraction:</span> {accountAbstraction}
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={logout}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-red bg-neon-yellow hover:bg-ocher-yellow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocher-yellow transition-colors duration-200"
        >
          Log Out
        </button>
      </div>

      {accountAbstraction && (
        <>
          <div className="text-center my-6">
            <h1 className="text-3xl font-bold text-white">Notus DX - Trilha B & C</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Portfolio accountAbstraction={accountAbstraction} />
            <LiquidityPools
              account={account}
              accountAbstraction={accountAbstraction}
              externallyOwnedAccount={externallyOwnedAccount}
            />
            <Swap
              account={account}
              accountAbstraction={accountAbstraction}
              externallyOwnedAccount={externallyOwnedAccount}
            />
            <TransferToken
              account={account}
              accountAbstraction={accountAbstraction}
              externallyOwnedAccount={externallyOwnedAccount}
            />
            {/* <TransactionHistory
              account={account}
              accountAbstraction={accountAbstraction}
              externallyOwnedAccount={externallyOwnedAccount}
            /> */}
          </div>
        </>
      )}

      <div id="console" className="mt-8 p-4 bg-graphite-gray rounded-md text-white text-sm overflow-auto max-h-40">
        <p className="whitespace-pre-line"></p>
      </div>
    </div>
  );
}
