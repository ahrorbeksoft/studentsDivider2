import { useStore } from "@tanstack/react-store";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { db } from "@/lib/db";
import { activeEditGroupStore, activeGroupStore, groupDialogStore } from "@/lib/stores";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function NewGroupDialog() {
  const [groupName, setGroupName] = useState("");
  const open = useStore(groupDialogStore);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const activeEditGroup = useStore(activeEditGroupStore);

  useEffect(() => {
    if (activeEditGroup) {
      setGroupName(activeEditGroup.name);
    } else {
      setGroupName("");
    }
  }, [activeEditGroup]);

  useEffect(() => {
    if (!open) {
      activeEditGroupStore.setState(() => null);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        groupDialogStore.setState(() => openState);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{activeEditGroup ? "Edit Group" : "Add Group"}</DialogTitle>
          <DialogDescription>
            {activeEditGroup ? "Edit the group name" : 'Create a new group by entering a name and clicking "Create".'}
          </DialogDescription>
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </DialogHeader>
        <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Enter the group name" />
        <DialogFooter>
          <Button
            onClick={async () => {
              if (!groupName) {
                setErrorMessage("Group name is required");
              } else {
                setErrorMessage(null);

                if (activeEditGroup) {
                  await db.groups.update(activeEditGroup.id, { name: groupName });
                  activeGroupStore.setState((state) => ({ ...state, name: groupName }));

                  activeEditGroupStore.setState(() => null);
                } else {
                  const groupId = await db.groups.add({
                    name: groupName,
                  });

                  const group = await db.groups.get(groupId);
                  if (group) {
                    activeGroupStore.setState(() => group);
                  }
                }

                groupDialogStore.setState(() => false);
                setGroupName("");
              }
            }}
          >
            {activeEditGroup ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
