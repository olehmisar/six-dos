import { AccountWallet } from "@aztec/aztec.js";
import { deployerCached } from "./DeployerCached";
import { BoolModuleContract } from "./bool_module/target/BoolModule";
import { EventContract } from "./event/target/Event";
import { LinksContract } from "./links/target/Links";

const LINKS_NAME = "links";
const EVENT_NAME = "event";
const BOOL_MODULE_NAME = "boolModule";
export async function deployContracts(account: AccountWallet) {
  const boolModule = await deployerCached.deployContractCached(
    BOOL_MODULE_NAME,
    (address) => BoolModuleContract.at(address, account),
    () => BoolModuleContract.deploy(account).send(),
  );
  const links = await deployerCached.deployContractCached(
    LINKS_NAME,
    (address) => LinksContract.at(address, account),
    () => LinksContract.deploy(account).send(),
  );
  const maxDegree = 2; // friends of friends only
  const event = await deployerCached.deployContractCached(
    EVENT_NAME,
    (address) => EventContract.at(address, account),
    () =>
      EventContract.deploy(
        account,
        account.getAddress(),
        links.address,
        boolModule.address,
        maxDegree,
      ).send(),
  );
  return { links, event, boolModule };
}
