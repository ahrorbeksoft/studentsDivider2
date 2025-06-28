import { useStore } from "@tanstack/react-store";
import { useLiveQuery } from "dexie-react-hooks";
import { Edit2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect } from "react";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { db } from "@/lib/db";
import { activeEditGroupStore, activeGroupStore, groupDialogStore, groupsStore, studentsStore } from "@/lib/stores";
import { Button } from "./extendui/button";
import { GroupSwitcher } from "./group-switcher";
import { NavStudents } from "./nav-students";
import { useConfirm } from "./ui/alert-dialog-provider";

export function AppSidebar() {
  const activeGroup = useStore(activeGroupStore);
  const groups = useStore(groupsStore);
  const students =
    useLiveQuery(
      () =>
        db.students
          .where("group_id")
          .equals(activeGroup?.id ?? 0)
          .toArray(),
      [activeGroup],
    ) || [];
  const confirm = useConfirm();

  useEffect(() => {
    if (students) {
      studentsStore.setState(() => students);
    }
  }, [students]);

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <GroupSwitcher />
        <div className="flex items-center justify-evenly border border-border p-2 rounded-md">
          <Button
            variant="outline"
            size="icon"
            tooltipText="Delete"
            disabled={!activeGroup}
            onClick={async () => {
              const confirmed = await confirm({
                title: "Are you sure?",
                body: "Do you want to delete this group?",
                actionButton: "Delete",
                actionButtonVariant: "destructive",
                cancelButton: "Cancel",
                cancelButtonVariant: "secondary",
              });
              if (confirmed) {
                await db.groups.delete(activeGroup.id);
                if (students.length > 0) {
                  // deleting the associated students
                  await db.students.bulkDelete(students.map((s) => s.id));
                }
                if (groups.length > 0) {
                  activeGroupStore.setState(() => groups[0]);
                } else {
                  // @ts-ignore
                  activeGroupStore.setState(() => null);
                }

                // Delete group logic here
              }
            }}
          >
            <TrashIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!activeGroup}
            tooltipText="Edit"
            onClick={() => {
              activeEditGroupStore.setState(() => activeGroup);
              groupDialogStore.setState(() => true);
            }}
          >
            <Edit2Icon className="w-5 h-5" />
          </Button>
          <Button
            disabled={!activeGroup}
            variant="outline"
            size="icon"
            tooltipText="Add Student"
            onClick={() => {
              if (activeGroup) {
                db.students.add({ group_id: activeGroup.id, name: `Student ${students.length + 1}` });
              }
            }}
          >
            <PlusIcon className="w-5 h-5" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavStudents />
      </SidebarContent>
    </Sidebar>
  );
}
