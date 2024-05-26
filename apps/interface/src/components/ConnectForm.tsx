import { useWallets } from "@/hooks/useWallets";
import { FC, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { useLinks } from "@/hooks/useLinks";
import { AztecAddress } from "@aztec/aztec.js";
import { sdk } from "@/sdk";
import { db } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { useWallet } from "@/hooks/useWallet";

export const ConnectForm: FC = () => {
  const [friendAddress, setFriendAddress] = useState("");

  const wallets = useWallets();

  const { linkContract } = useLinks(wallets?.alice);

  const wallet = useWallet(db.data.address);

  const addLinkMutation = useMutation({
    mutationFn: async (address2: string) => {
      if (wallet) {
        await sdk.addLink(wallet, AztecAddress.fromString(address2));
        db.update((data) => {
          if (data.links[data.address] == undefined) {
            data.links[data.address] = [address2];
          } else {
            data.links[data.address]!.push(address2);
          }
        });
      }
    },
  });

  console.log("addLinkMutation", addLinkMutation.status);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect</CardTitle>
        <CardDescription>Create a link between two people</CardDescription>
      </CardHeader>
      <CardContent className="gap-4 flex flex-col">
        <p>You</p>
        <Input disabled value={db.data.address} />
        <p>Friend</p>
        <Input
          placeholder="0x..."
          value={friendAddress}
          onChange={(e) => setFriendAddress(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          disabled={
            friendAddress === "" ||
            linkContract == null ||
            addLinkMutation.isPending
          }
          onClick={() => addLinkMutation.mutate(friendAddress)}
        >
          {addLinkMutation.isIdle && "Submit"}
          {addLinkMutation.isPending && "Submitting..."}
          {addLinkMutation.isSuccess && "Success!"}
          {addLinkMutation.isError && "Error!"}
        </Button>
      </CardFooter>
    </Card>
  );
};
