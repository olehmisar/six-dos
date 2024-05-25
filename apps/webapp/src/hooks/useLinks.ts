import { useEffect, useState } from "react";

import { LinksContract } from "@six-dos/contracts/src/links/target/Links";
import { AztecAddress, Wallet } from "@aztec/aztec.js";
import addresses from "@six-dos/contracts/deployments.json";

export const useLinks = (wallet: Wallet | undefined) => {
  const [linkContract, setContract] = useState<LinksContract>();

  useEffect(() => {
    if (wallet != null) {
      const setupContract = async () => {
        const contract = await LinksContract.at(
          AztecAddress.fromString(addresses.links),
          wallet,
        );

        setContract(contract);
      };
      setupContract();
    }
  }, [wallet]);

  return { linkContract };
};
