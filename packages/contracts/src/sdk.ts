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
    private contracts: {
      links: LinksContract;
      event: EventContract;
    },
  ) {}

  async addLink(from: AccountWallet, to: AztecAddress) {
    const shouldInit = !(await this.contracts.links.methods
      .link_exists(from.getAddress(), to)
      .simulate()) as boolean;
    return await this.contracts.links
      .withWallet(from)
      .methods.add_link(from.getAddress(), to, shouldInit)
      .send()
      .wait();
  }
}
