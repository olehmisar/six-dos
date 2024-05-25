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

export const ConnectForm: FC = () => {
  const [address2, setAddress2] = useState("");

  const wallets = useWallets();
  console.log("alice", wallets?.alice.getAddress().toString());
  console.log("bob", wallets?.bob.getAddress().toString());

  const { linkContract } = useLinks(wallets?.alice);
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
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          disabled={address2 === "" || linkContract == null}
          onClick={() => {
            if (wallets?.alice) {
              sdk.addLink(wallets?.alice, AztecAddress.fromString(address2));
              db.update((data) => {
                data.links.push(address2);
              });
            }
          }}
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};
