import { useWallets } from "./useWallets";

export const useWallet = (address: string) => {
  const wallets = useWallets();

  return Object.values(wallets ?? {}).find(
    (wallet) =>
      wallet.getAddress().toString().toLowerCase() === address.toLowerCase(),
  );
};
