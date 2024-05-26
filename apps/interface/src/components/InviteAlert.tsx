import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function InviteAlert({ isInvited }: { isInvited: boolean }) {
  return (
    <Alert variant={isInvited ? "default" : "destructive"} className="max-w-lg">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{isInvited ? ":)" : ":("}</AlertTitle>
      <AlertDescription>
        {isInvited ? "You are invited!" : "You are not invited"}
      </AlertDescription>
    </Alert>
  );
}
