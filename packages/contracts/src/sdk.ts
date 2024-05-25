import {
  AccountWallet,
  AztecAddress,
  createPXEClient,
  waitForPXE,
} from "@aztec/aztec.js";
import type { EventContract } from "./event/target/Event";
import type { LinksContract } from "./links/target/Links";

const defaultPxeUrl =
  "https://musical-dollop-jrv9x75g6552pgvv-8080.app.github.dev/";
export async function getPxe({ url = defaultPxeUrl }: { url?: string } = {}) {
  const pxe = createPXEClient(url);
  await waitForPXE(pxe);
  return pxe;
}

export const LINKS_NAME = "links";
export const EVENT_NAME = "event";

export class SixDosSdk {
  constructor(
    private contracts: () => Promise<{
      links: LinksContract;
      event: EventContract;
    }>,
  ) {}

  async addLink(from: AccountWallet, to: AztecAddress) {
    const contracts = await this.contracts();
    const shouldInit = !(await contracts.links.methods
      .link_exists(from.getAddress(), to)
      .simulate()) as boolean;
    return await contracts.links
      .withWallet(from)
      .methods.add_link(from.getAddress(), to, shouldInit)
      .send()
      .wait();
  }

  /**
   *  We invite the person by asserting that they are associated with us. The degree is checked on-chain.
   */
  async invite(from: AccountWallet, to: AztecAddress) {
    const contracts = await this.contracts();
    return await contracts.event
      .withWallet(from)
      .methods.assert_associated_with_me(to)
      .send()
      .wait();
  }

  async ownerGetDegreeOf(owner: AccountWallet, account: AztecAddress) {
    const contracts = await this.contracts();
    return (await contracts.event
      .withWallet(owner)
      .methods.owner_get_degree_of(account)
      .simulate()) as bigint;
  }

  async associateGetDegreeOf(account: AccountWallet) {
    const contracts = await this.contracts();
    return (await contracts.event
      .withWallet(account)
      .methods.associate_get_degree_of(account.getAddress())
      .simulate()) as bigint;
  }
}
