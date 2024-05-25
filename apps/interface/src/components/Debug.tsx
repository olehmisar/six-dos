import { FC, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { db } from "@/store";

export const Debug: FC = () => {
  const [myAddress, setMyAddress] = useState(
    db.data.address == ""
      ? "0x06df9120d88244aac6a6df8562e40a09fecea46c6938548683aa707a81d3c8ee"
      : db.data.address,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug</CardTitle>
      </CardHeader>
      <CardContent className="gap-4 flex flex-col">
        <div className="gap-2 flex flex-row items-center justify-between">
          <p className="whitespace-nowrap">Clear DB</p>
          <Button>Ok</Button>
        </div>
        <div className="gap-2 flex flex-row items-center justify-between">
          <p className="whitespace-nowrap">Set address</p>
          <Input
            placeholder="0x..."
            value={myAddress}
            onChange={(e) => setMyAddress(e.target.value)}
          />
          <Button
            onClick={() =>
              db.update((data) => {
                data.address = myAddress;
              })
            }
          >
            Update
          </Button>
        </div>
        <div className="flex flex-col">
          <p>Links</p>
          {db.data.links[db.data.address]?.map((link) => (
            <div key={link}>
              <p>{link}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
