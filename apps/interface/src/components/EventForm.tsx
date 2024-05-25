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

export const EventForm: FC = () => {
  const [address1, setAddress1] = useState("");

  const wallets = useWallets();
  console.log("alice", wallets?.alice.getAddress().toString())
  console.log("bob", wallets?.bob.getAddress().toString())

    const { linkContract } = useLinks(wallets?.alice);
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Private Fundraiser</CardTitle>
        <CardDescription>Friends of friends are welcome. Let a guest know of your intent to come.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4 flex flex-col">
        <p>RSVP</p>
        <Input
          placeholder="0x..."
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          disabled={address1 === "" || linkContract == null}
          onClick={() => {
            if (wallets?.alice) {
            sdk.addLink(wallets?.alice,
              AztecAddress.fromString(address1),
            );}
          }}
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};
