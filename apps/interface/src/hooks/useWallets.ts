import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { AccountWalletWithSecretKey } from "@aztec/aztec.js";
import { getPxe } from "@six-dos/contracts/src/sdk";
import { useEffect, useState } from "react";

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
