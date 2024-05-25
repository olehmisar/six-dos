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
import { useWallet } from "@/hooks/useWallet";
import { useMutation, useQuery } from "@tanstack/react-query";

export const EventForm: FC = () => {
  const [friendAddress, setFriendAddress] = useState("");
  const wallets = useWallets();

  const { linkContract } = useLinks(wallets?.alice);

  const wallet = useWallet(db.data.address);

  const degreeQuery = useQuery({
    queryKey: ["degree", wallet?.getAddress().toString()],
    queryFn: async () => {
      const degree = await sdk.associateGetDegreeOf(wallet!);
      return degree;
    },
    enabled: wallet != null,
  });

  const maxDegreeQuery = useQuery({
    queryKey: ["maxDegree"],
    queryFn: async () => {
      const maxDegree = await sdk.getMaxAllowedDegree();
      return maxDegree;
    },
  });

  const isInvited = degreeQuery.data != null && degreeQuery.data >= 0;
  const canInvite =
    maxDegreeQuery.data != null &&
    degreeQuery.data != null &&
    degreeQuery.data < maxDegreeQuery.data;

  console.log("isInvited", isInvited);
  console.log("canInvite", canInvite);

  const inviteMutation = useMutation({
    mutationFn: async (address: string) => {
      if (wallet) {
        await sdk.invite(wallet, AztecAddress.fromString(address));
      }
    },
  });
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Private Fundraiser</CardTitle>
        <CardDescription>
          Friends of friends are welcome.
          <br /> Who would you like to invite?
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-4 flex flex-col">
        <p>Invite</p>
        <Input
          placeholder="0x..."
          value={friendAddress}
          onChange={(e) => setFriendAddress(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          disabled={
            (friendAddress === "" || linkContract == null || wallet == null) &&
            !isInvited &&
            !canInvite
          }
          onClick={() => inviteMutation.mutate(friendAddress)}
        >
          {(maxDegreeQuery.isLoading || degreeQuery.isLoading) && "Loading..."}
          {isInvited && canInvite && inviteMutation.isIdle && "Submit"}
          {!isInvited && "Not invited"}
          {isInvited && !canInvite && "Can't invite"}
          {inviteMutation.isPending && "Submitting..."}
          {inviteMutation.isSuccess && "Success!"}
          {inviteMutation.isError && "Error!"}
        </Button>
      </CardFooter>
    </Card>
  );
};
