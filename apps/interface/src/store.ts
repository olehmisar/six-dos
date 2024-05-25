import { LocalStoragePreset } from "lowdb/browser";

type Data = {
  address: string;
  links: Record<string, string[] | undefined>;
};

const defaultData: Data = {
  address: "0x06df9120d88244aac6a6df8562e40a09fecea46c6938548683aa707a81d3c8ee",
  links: {
    "0x06df9120d88244aac6a6df8562e40a09fecea46c6938548683aa707a81d3c8ee": [],
  },
};
export const db = LocalStoragePreset<Data>("db", defaultData);
