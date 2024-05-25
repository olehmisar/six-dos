import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { type AccountWallet, type PXE } from "@aztec/aztec.js";
import { beforeAll, describe, expect, test } from "vitest";
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
    const ownerDegree = await sdk.ownerGetDegreeOf(eventOwner.getAddress());
    await sdk.addLink(eventOwner, alice.getAddress());
    await sdk.addLink(alice, bob.getAddress());

    await sdk.invite(eventOwner, alice.getAddress());
    await sdk.invite(alice, bob.getAddress());

    const aliceDegree = await sdk.ownerGetDegreeOf(alice.getAddress());
    const bobDegree = await sdk.ownerGetDegreeOf(bob.getAddress());
    expect(ownerDegree).toBe(0n);
    expect(aliceDegree).toBe(1n);
    expect(bobDegree).toBe(2n);
  });
});
