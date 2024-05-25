import { AztecAddress } from "@aztec/aztec.js";
import { getPxe, SixDosSdk } from "@six-dos/contracts/src/sdk";
import { LinksContract } from "@six-dos/contracts/src/links/target/Links";
import addresses from "@six-dos/contracts/deployments.json";
import { EventContract } from "@six-dos/contracts/src/event/target/Event";
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";

export const sdk = new SixDosSdk(async () => {
  const pxe = await getPxe();
  const [eventOwner] = await getInitialTestAccountsWallets(pxe);
  console.log("addresses", addresses);
  return {
    links: await LinksContract.at(
      AztecAddress.fromString(addresses.links),
      eventOwner,
    ),
    event: await EventContract.at(
      AztecAddress.fromString(addresses.event),
      eventOwner,
    ),
  };
});
