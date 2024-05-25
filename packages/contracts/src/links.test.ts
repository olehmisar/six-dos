import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { type AccountWallet, type PXE } from "@aztec/aztec.js";
import { beforeAll, describe, test } from "vitest";
import { deployContracts } from "./deployContracts.js";
import { EventContract } from "./event/target/Event.js";
import { LinksContract } from "./links/target/Links.js";
import { SixDosSdk, getPxe } from "./sdk.js";

describe("Bridge", () => {
  let pxe: PXE;
  let eventOwner: AccountWallet, alice: AccountWallet, bob: AccountWallet;
  let contracts: { links: LinksContract; event: EventContract };
  let sdk: SixDosSdk;
  beforeAll(async () => {
    pxe = await getPxe();
    [eventOwner, alice, bob] = await getInitialTestAccountsWallets(pxe);
    const deployer = eventOwner;
    contracts = await deployContracts(deployer);
    sdk = new SixDosSdk(async () => contracts);
  });

  test("works", async () => {
    const ownerDegree = await sdk.getDegreeOf(eventOwner.getAddress());
    console.log("ownerDegree", ownerDegree);
    await sdk.addLink(eventOwner, alice.getAddress());
    await sdk.addLink(alice, bob.getAddress());

    await contracts.event
      .withWallet(eventOwner)
      .methods.assert_associated_with_me(alice.getAddress())
      .send()
      .wait();

    await contracts.event
      .withWallet(alice)
      .methods.assert_associated_with_me(bob.getAddress())
      .send()
      .wait();

    console.log("alice degree", await sdk.getDegreeOf(alice.getAddress()));
    console.log("bob degree", await sdk.getDegreeOf(bob.getAddress()));
  });
});
