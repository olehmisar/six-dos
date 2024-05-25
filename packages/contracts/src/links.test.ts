import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import {
  AztecAddress,
  createPXEClient,
  waitForPXE,
  type AccountWallet,
  type PXE,
} from "@aztec/aztec.js";
import { beforeAll, describe, test } from "vitest";
import { EventContract } from "./event/target/Event.js";
import { LinksContract } from "./links/target/Links.js";

const PXE_URL = "http://localhost:8080";

describe("Bridge", () => {
  let pxe: PXE;
  let eventOwner: AccountWallet, alice: AccountWallet, bob: AccountWallet;
  let linksContract: LinksContract;
  let eventContract: EventContract;
  beforeAll(async () => {
    pxe = createPXEClient(PXE_URL);
    await waitForPXE(pxe);
    [eventOwner, alice, bob] = await getInitialTestAccountsWallets(pxe);
    const deployer = eventOwner;
    linksContract = await LinksContract.deploy(deployer).send().deployed();
    // eventContract = await EventContract.deploy(
    //   deployer,
    //   eventOwner.getAddress(),
    //   linksContract.address,
    // )
    //   .send()
    //   .deployed();
  });

  test("works", async () => {
    await addLink(eventOwner, alice.getAddress());
    await addLink(alice, bob.getAddress());
  });

  async function addLink(from: AccountWallet, to: AztecAddress) {
    return await linksContract
      .withWallet(from)
      .methods.add_link(from.getAddress(), to)
      .send()
      .wait();
  }
});
