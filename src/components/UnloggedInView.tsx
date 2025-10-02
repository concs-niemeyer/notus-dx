
'use client';

interface UnloggedInViewProps {
  login: () => void;
  isInitializing: boolean;
}

export default function UnloggedInView({ login, isInitializing }: UnloggedInViewProps) {
  return (
    <div className="bg-graphite-gray text-white min-h-screen flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-black space-y-8 p-10 rounded-xl shadow-2xl text-black">
        <h1 className="text-center text-4xl font-extrabold text-white mb-8">
          <a
            target="_blank"
            href="https://web3auth.io/docs/sdk/pnp/web/modal"
            rel="noreferrer"
            className="text-neon-yellow hover:text-ocher-yellow transition-colors duration-200"
          >
            Web3Auth
          </a>{" "}
          & Notus API - PoC: Trilha B e C
        </h1>

        <div className="flex flex-col items-center justify-center">
          <button
            onClick={login}
            className="w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 bg-neon-yellow text-black border-white hover:bg-ocher-yellow"
            style={{
              boxShadow: '0 4px 6px -1px rgba(255, 214, 10, 0.1), 0 2px 4px -2px rgba(255, 214, 10, 0.1)', // neon-yellow shadow
            }}
            disabled={isInitializing}
          >
            {isInitializing ? "Initializing..." : "Connect Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
}
