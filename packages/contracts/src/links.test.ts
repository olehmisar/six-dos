import { getSchnorrAccount } from "@aztec/accounts/schnorr";
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import {
  Fr,
  GrumpkinScalar,
  type AccountWallet,
  type PXE,
} from "@aztec/aztec.js";
import { beforeAll, describe, expect, test } from "vitest";
import { deployContracts } from "./deployContracts.js";
import { SixDosSdk, getPxe } from "./sdk.js";

describe("Bridge", () => {
  let pxe: PXE;
  let eventOwner: AccountWallet,
    alice: AccountWallet,
    bob: AccountWallet,
    charlie: AccountWallet;
  let random: AccountWallet;
  let sdk: SixDosSdk;
  beforeAll(async () => {
    pxe = await getPxe();
    [eventOwner, alice, bob] = await getInitialTestAccountsWallets(pxe);
    charlie = await createAccount(pxe);
    random = await createAccount(pxe);
    const deployer = eventOwner;
    const contracts = await deployContracts(deployer);
    sdk = new SixDosSdk(async () => contracts);
  });

  test("works", async () => {
    const ownerDegree = await sdk.ownerGetDegreeOf(
      eventOwner,
      eventOwner.getAddress(),
    );
    await sdk.addLink(eventOwner, alice.getAddress());
    await sdk.addLink(alice, bob.getAddress());
    await sdk.addLink(bob, charlie.getAddress());

    await sdk.invite(eventOwner, alice.getAddress());
    await sdk.invite(alice, bob.getAddress());

    const aliceDegree = await sdk.ownerGetDegreeOf(
      eventOwner,
      alice.getAddress(),
    );
    const bobDegree = await sdk.ownerGetDegreeOf(eventOwner, bob.getAddress());
    expect(ownerDegree).toBe(0n);
    expect(aliceDegree).toBe(1n);
    expect(bobDegree).toBe(2n);
  });

  test("fails if degree is too high", async () => {
    await expect(sdk.invite(bob, charlie.getAddress())).rejects.toThrow(
      "Cannot satisfy constraint",
    );
  });

  test('fails if "from" is not a link', async () => {
    await expect(sdk.invite(random, bob.getAddress())).rejects.toThrow(
      "Failed to solve brillig function",
    );
  });

  test('fails if "to" is not a link', async () => {
    await expect(sdk.invite(bob, random.getAddress())).rejects.toThrow(
      "Failed to solve brillig function",
    );
  });
});

async function createAccount(pxe: PXE) {
  const secretKey = Fr.random();
  const signingPrivateKey = GrumpkinScalar.random();
  const account = await getSchnorrAccount(
    pxe,
    secretKey,
    signingPrivateKey,
  ).waitSetup();
  return account;
}
