import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { AztecAddress, type AccountWallet, type PXE } from "@aztec/aztec.js";
import { beforeAll, describe, test } from "vitest";
import { deployContracts } from "./deployContracts.js";
import { EventContract } from "./event/target/Event.js";
import { LinksContract } from "./links/target/Links.js";
import { getPxe } from "./sdk.js";

describe("Bridge", () => {
  let pxe: PXE;
  let eventOwner: AccountWallet, alice: AccountWallet, bob: AccountWallet;
  let contracts: { links: LinksContract; event: EventContract };
  beforeAll(async () => {
    pxe = await getPxe();
    [eventOwner, alice, bob] = await getInitialTestAccountsWallets(pxe);
    const deployer = eventOwner;
    contracts = await deployContracts(deployer);
  });

  test("works", async () => {
    await addLink(eventOwner, alice.getAddress());
    await addLink(alice, bob.getAddress());

    await contracts.event
      .withWallet(alice)
      .methods.assert_associated_with(eventOwner.getAddress(), 0)
      .send()
      .wait();
  });

  async function addLink(from: AccountWallet, to: AztecAddress) {
    const shouldInit = !(await contracts.links.methods
      .link_exists(from.getAddress(), to)
      .simulate()) as boolean;
    return await contracts.links
      .withWallet(from)
      .methods.add_link(from.getAddress(), to, shouldInit)
      .send()
      .wait();
  }
});
