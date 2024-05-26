import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import {
  AccountWallet,
  AztecAddress,
  createPXEClient,
  waitForPXE,
} from "@aztec/aztec.js";
import { BoolModuleContract } from "./bool_module/target/BoolModule";
import { EventContract } from "./event/target/Event";
import { LinksContract } from "./links/target/Links";

const defaultPxeUrl =
  "https://musical-dollop-jrv9x75g6552pgvv-8080.app.github.dev/";
export async function getPxe({ url = defaultPxeUrl }: { url?: string } = {}) {
  const pxe = createPXEClient(url);
  await waitForPXE(pxe);
  return pxe;
}

export class SixDosSdk {
  private contracts: Promise<{
    links: LinksContract;
    event: EventContract;
    boolModule: BoolModuleContract;
  }>;
  constructor(
    contracts: () => Promise<{
      links: LinksContract;
      event: EventContract;
    }>,
  ) {
    this.contracts = contracts().then(async (c) => {
      const [account] = await getInitialTestAccountsWallets(await getPxe());
      const boolModule = await BoolModuleContract.at(
        await c.event.methods.links_module().simulate(),
        account,
      );
      return {
        boolModule,
        ...c,
      };
    });
  }

  async addLink(from: AccountWallet, to: AztecAddress) {
    const contracts = await this.contracts;
    const shouldInit = !(await contracts.links.methods
      .link_is_initialized(from.getAddress(), to, contracts.boolModule.address)
      .simulate()) as boolean;
    return await contracts.links
      .withWallet(from)
      .methods.add_link(to, contracts.boolModule.address, shouldInit)
      .send()
      .wait();
  }

  /**
   * We invite the person by asserting that they are associated with us. The degree is checked on-chain.
   */
  async invite(from: AccountWallet, to: AztecAddress) {
    const contracts = await this.contracts;
    return await contracts.event
      .withWallet(from)
      .methods.assert_associated_with_me(to)
      .send()
      .wait();
  }

  /**
   * Owner can see the degree of association of any account.
   */
  async ownerGetDegreeOf(owner: AccountWallet, account: AztecAddress) {
    const contracts = await this.contracts;
    return (await contracts.event
      .withWallet(owner)
      .methods.owner_get_degree_of(account)
      .simulate()) as bigint;
  }

  /**
   * Associate can see the degree of only their own account.
   */
  async associateGetDegreeOf(account: AccountWallet) {
    const contracts = await this.contracts;
    try {
      const result = (await contracts.event.methods
        .associate_get_degree_of(account.getAddress())
        .simulate()) as bigint;

      return {
        degree: result,
        isInvited: true,
      };
    } catch (e) {
      console.log("associateGetDegreeOf", account.getAddress(), e);
      return {
        isInvited: false,
      };
    }
  }

  async getMaxAllowedDegree() {
    const contracts = await this.contracts;
    return (await contracts.event.methods.max_degree().simulate()) as bigint;
  }
}
