import fs from "node:fs";

/**
 * Deploys contracts. If a contract is already deployed, it will use the cached address.
 * If you update the contract, you should clear the cache using the respective methods.
 */
export class DeployerCached {
  getContractCacheKey = (/** @type {string} */ name) => `${name}`;

  /**
   * @template T
   * @param {string} name
   * @param {(address: string) => Promise<T>} connect
   */
  async getContractCached(name, connect) {
    const key = this.getContractCacheKey(name);
    const cachedAddress = storage.getItem(key);
    if (!cachedAddress) {
      return undefined;
    }
    try {
      const connected = await connect(cachedAddress);
      console.log(`Using cached ${name}...`);
      return connected;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (/** @type {any} */ e) {
      if (e?.message.includes("is not deployed")) {
        this.clearContractCache(name);
        return undefined;
      }
      throw e;
    }
  }

  /**
   * @template {import('@aztec/aztec.js').Contract} T
   * @param {string} name
   * @param {(address: import('@aztec/aztec.js').AztecAddress) => Promise<T>} connect
   * @param {() => import('ts-essentials').AsyncOrSync<import('@aztec/aztec.js').DeploySentTx<T>>} deploy
   */
  async deployContractCached(name, connect, deploy) {
    const { AztecAddress } = await import("@aztec/aztec.js");
    return this.#deployCached(
      name,
      (addr) => connect(AztecAddress.fromString(addr)),
      async () => {
        const tx = await deploy();
        console.log(
          `Deploying ${name} tx hash:`,
          (await tx.getTxHash()).toString(),
        );
        const contract = await tx.deployed();
        console.log(`Deployed ${name} at ${contract.address.toString()}`);
        return {
          address: contract.address.toString(),
          contract,
        };
      },
    );
  }

  /**
   * @template T
   * @param {string} name
   * @param {(address: string) => Promise<T>} connect
   * @param {() => Promise<{ contract: T, address: string }>} deploy
   * @returns {Promise<T>}
   */
  async #deployCached(name, connect, deploy) {
    const cached = await this.getContractCached(name, connect);
    if (cached) {
      return cached;
    }
    console.log(`Deploying ${name}...`);
    const { address, contract } = await deploy();
    storage.setItem(this.getContractCacheKey(name), address.toString());
    return contract;
  }

  /**
   * @param {string} name
   */
  clearContractCache(name) {
    storage.removeItem(this.getContractCacheKey(name));
  }
}

export const deployerCached = new DeployerCached();

const filename = "deployments.json";
const inMemoryStorage = {
  /**
   * @param {string} key
   * @returns {string | null}
   */
  getItem(key) {
    if (!fs.existsSync(filename)) {
      return null;
    }
    try {
      return JSON.parse(fs.readFileSync(filename, "utf8"))[key] ?? null;
    } catch (e) {
      console.warn(e);
      return null;
    }
  },
  /**
   * @param {string} key
   * @param {string} value
   */
  setItem(key, value) {
    try {
      const data = JSON.parse(
        fs.existsSync(filename) ? fs.readFileSync(filename, "utf8") : "{}",
      );
      data[key] = value;
      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    } catch (e) {
      throw new Error(`Failed to write to storage: ${e}`);
    }
  },
  /**
   * @param {string} key
   */
  removeItem(key) {
    try {
      const data = JSON.parse(
        fs.existsSync(filename) ? fs.readFileSync(filename, "utf8") : "{}",
      );
      delete data[key];
      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    } catch (e) {
      throw new Error(`Failed to write to storage: ${e}`);
    }
  },
};
const storage = inMemoryStorage;
