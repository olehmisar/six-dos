import { AccountWallet } from "@aztec/aztec.js";
import { deployerCached } from "./DeployerCached";
import { EventContract } from "./event/target/Event";
import { LinksContract } from "./links/target/Links";
import { EVENT_NAME, LINKS_NAME } from "./sdk";

export async function deployContracts(account: AccountWallet) {
  const links = await deployerCached.deployContractCached(
    LINKS_NAME,
    (address) => LinksContract.at(address, account),
    () => LinksContract.deploy(account).send(),
  );
  const event = await deployerCached.deployContractCached(
    EVENT_NAME,
    (address) => EventContract.at(address, account),
    () =>
      EventContract.deploy(account, account.getAddress(), links.address).send(),
  );
  return { links, event };
}
