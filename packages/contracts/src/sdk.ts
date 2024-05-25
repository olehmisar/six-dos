import {
  AccountWallet,
  AztecAddress,
  createPXEClient,
  waitForPXE,
} from "@aztec/aztec.js";
import { deployerCached } from "./DeployerCached";
import { EventContract } from "./event/target/Event";
import { LinksContract } from "./links/target/Links";

const defaultPxeUrl =
  "https://musical-dollop-jrv9x75g6552pgvv-8080.app.github.dev/";
export async function getPxe({ url = defaultPxeUrl }: { url?: string } = {}) {
  const pxe = createPXEClient(url);
  await waitForPXE(pxe);
  return pxe;
}

export const LINKS_NAME = "links";
export const EVENT_NAME = "event";
export async function getContracts(account: AccountWallet) {
  const links = await deployerCached.getContractCached(LINKS_NAME, (address) =>
    LinksContract.at(AztecAddress.fromString(address), account),
  );
  const event = await deployerCached.getContractCached(EVENT_NAME, (address) =>
    EventContract.at(AztecAddress.fromString(address), account),
  );
  return { links, event };
}
