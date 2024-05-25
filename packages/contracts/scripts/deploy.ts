import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { deployerCached } from "../src/DeployerCached";
import { deployContracts } from "../src/deployContracts";
import { getPxe } from "../src/sdk";

async function main() {
  const pxe = await getPxe();
  const [eventOwner] = await getInitialTestAccountsWallets(pxe);
  const deployer = eventOwner;
  deployerCached.clearAllContractCaches();
  await deployContracts(deployer);
}
main();
