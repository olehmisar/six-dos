import {
  AccountContract,
  Fr,
  PXE,
  createPXEClient,
  deriveMasterIncomingViewingSecretKey,
} from "@aztec/aztec.js";
import { AccountManager } from "@aztec/aztec.js/account";
import { SingleKeyAccountContract } from "@aztec/accounts/single_key";
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { LinksContract } from "@six-dos/contracts/src/links/target/Links";
import { getPxe } from "@six-dos/contracts/src/sdk";

class PrivateEnv {
  pxe: Promise<PXE>;

  constructor() {
    this.pxe = getPxe();
  }

  async getWallets() {
    // taking advantage that register is no-op if already registered
    const [eventOwner, alice, bob] = await getInitialTestAccountsWallets(
      await this.pxe,
    );

    return {
      eventOwner,
      alice,
      bob,
    };
  }
}

export const deployerEnv = new PrivateEnv();
