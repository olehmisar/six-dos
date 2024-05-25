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

export const ConnectForm: FC = () => {
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const wallets = useWallets();
  //   const { linkContract } = useLinks(wallets?.alice);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect friends</CardTitle>
        <CardDescription>Create a link between two parties</CardDescription>
      </CardHeader>
      <CardContent className="gap-4 flex flex-col">
        <p>You</p>
        <Input
          placeholder="0x..."
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
        />
        <p>Friend</p>
        <Input
          placeholder="0x..."
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
        //   disabled={address1 === "" || address2 === "" || linkContract == null}
        //   onClick={() => {
        //     linkContract?.methods.add_link(
        //       AztecAddress.fromString(address1),
        //       AztecAddress.fromString(address2),
        //       false,
        //     );
        //   }}
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};
