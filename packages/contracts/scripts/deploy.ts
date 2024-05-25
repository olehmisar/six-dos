import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { deployerCached } from "../src/DeployerCached";
import { deployContracts } from "../src/deployContracts";
import { getPxe } from "../src/sdk";

async function main() {
  const pxe = await getPxe();
  const [eventOwner] = await getInitialTestAccountsWallets(pxe);
  deployerCached.clearAllContractCaches();
  await deployContracts(eventOwner);
  console.log("owner", eventOwner.getAddress().toString());
}
main();
