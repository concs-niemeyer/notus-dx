
"use client";

import { useEffect, useState, useCallback } from "react";
import { Web3Auth, Web3AuthOptions, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { createWalletClient, custom, WalletClient } from "viem";
import { polygon } from "viem/chains";
import LoggedInView from "./LoggedInView";
import UnloggedInView from "./UnloggedInView";

interface WalletData {
  externallyOwnedAccount: string;
  accountAbstraction: string;
  walletAddress: string;
}

const FACTORY_ADDRESS = "0x0000000000400cdfef5e2714e63d8040b700bc24"; // ligthning factory

const clientId =
  process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ||
  "";

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
};

const web3auth = new Web3Auth(web3AuthOptions);

const baseUrl = "https://api.notus.team/api/v1";
const apikey = process.env.NEXT_PUBLIC_NOTUS_API_KEY || "your_notus_api_key";

export default function ConnectWallet() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [account, setAccount] = useState<WalletClient | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [accountAbstraction, setAccountAbstraction] = useState("");
  const [externallyOwnedAccount, setExternallyOwnedAccount] = useState("");

  const getSmartWalletAddress = useCallback(async () => {
    console.log("Getting smart wallet address for:", externallyOwnedAccount);

    // Check if the wallet is already registered
    const getWalletsUrl = `${baseUrl}/wallets`;
    const walletsRes = await fetch(getWalletsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apikey,
      },
    });

  if (walletsRes.ok) {
  const { wallets = [] } = await walletsRes.json();

  console.log("Wallets Data by Projects in Notus Lab:", wallets);
  console.log("ADDRESS EOA:", wallets[0]?.externallyOwnedAccount);

  // Procura a wallet registrada com base no externallyOwnedAccount
  const registeredWallet = wallets.find(
    (wallet: WalletData) =>
      wallet?.externallyOwnedAccount?.toLowerCase() ===
      externallyOwnedAccount.toLowerCase()
  );

  if (registeredWallet) {
    console.log("Wallet already registered:", registeredWallet.walletAddress);
    setAccountAbstraction(registeredWallet.accountAbstraction);
    console.log("ConnectWallet: setAccountAbstraction (registered wallet) to:", registeredWallet.accountAbstraction);
    return;
  }

  console.log("No wallet registered for this EOA:", externallyOwnedAccount);
}

    // If not registered, then register a new wallet
    let res = await fetch(`${baseUrl}/wallets/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apikey,
      },
      body: JSON.stringify({
        externallyOwnedAccount: externallyOwnedAccount,
        factory: FACTORY_ADDRESS,
        salt: "12345",
      }),
    });

    if (!res?.ok) {
      res = await fetch(
        `${baseUrl}/wallets/address?externallyOwnedAccount=${externallyOwnedAccount}&factory=${FACTORY_ADDRESS}&salt=${12345}`,
        {
          method: "GET",
          headers: {
            "x-api-key": apikey,
          },
        }
      );
    }

    const data = await res.json();
    console.log("Smart wallet address data:", data);
    setAccountAbstraction(data.wallet.accountAbstraction);
    console.log("ConnectWallet: setAccountAbstraction (newly registered/fetched) to:", data.wallet.accountAbstraction);
  }, [externallyOwnedAccount]);

  useEffect(() => {
    if (externallyOwnedAccount) {
      getSmartWalletAddress();
    }
  }, [externallyOwnedAccount, getSmartWalletAddress]);

  const login = async () => {
    console.log("login called");
    const web3authProvider = await web3auth.connect();
    if (!web3authProvider) {
      return;
    }
    const account = createWalletClient({
      chain: polygon,
      transport: custom(web3authProvider),
    });
    const [address] = await account.getAddresses();
    console.log("Logged in with address:", address);
    setExternallyOwnedAccount(address);
    setAccount(account);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const logout = async () => {
    await web3auth.logout();
    setAccount(null);
    setLoggedIn(false);
  };

  useEffect(() => {
    const init = async () => {
      console.log("init started");
      try {
        await web3auth.init();
        if (!web3auth.provider) {
          return;
        }
        const account = createWalletClient({
          chain: polygon,
          transport: custom(web3auth.provider),
        });

        const [address] = await account.getAddresses();
        console.log("Initialized with address:", address);
        setExternallyOwnedAccount(address);
        setAccount(account);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitializing(false);
        console.log("init finished");
      }
    };
    if (typeof window !== "undefined") {
      init();
    }
  }, []);

  return (
    <>
      {loggedIn ? (
        <LoggedInView
          logout={logout}
          account={account}
          accountAbstraction={accountAbstraction}
          externallyOwnedAccount={externallyOwnedAccount}
        />
      ) : (
        <UnloggedInView login={login} isInitializing={isInitializing} />
      )}
    </>
  );
}
