import { useEffect, useState } from "react";

import { AccountWalletWithSecretKey, Wallet } from "@aztec/aztec.js";
import { deployerEnv } from "@/config";
import { getPxe } from "@six-dos/contracts/src/sdk";
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";

export const useWallets = () => {
  const [wallets, setWallets] = useState<{
    eventOwner: AccountWalletWithSecretKey;
    alice: AccountWalletWithSecretKey;
    bob: AccountWalletWithSecretKey;
  }>();

  useEffect(() => {
    const setupWallets = async () => {
      const pxe = await getPxe();
      const [eventOwner, alice, bob] = await getInitialTestAccountsWallets(pxe);
      setWallets({
        eventOwner,
        alice,
        bob,
      });
    };
    setupWallets();
  }, []);

  return wallets;
};
