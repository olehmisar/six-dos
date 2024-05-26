import { LocalStoragePreset } from "lowdb/browser";

type Data = {
  address: string;
  links: Record<string, string[] | undefined>;
};

export const defaultData: Data = {
  address: "0x14f7a3f6de857d54350353673d1a0f76afc35bd06e22079bc44a8c9fe61cf51e",
  links: {
    "0x14f7a3f6de857d54350353673d1a0f76afc35bd06e22079bc44a8c9fe61cf51e": [],
  },
};
export const db = LocalStoragePreset<Data>("db", defaultData);
