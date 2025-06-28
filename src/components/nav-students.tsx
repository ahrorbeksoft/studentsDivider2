"use client";

import { useStore } from "@tanstack/react-store";
import { useLiveQuery } from "dexie-react-hooks";
import { Trash2, UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // useSidebar,
} from "@/components/ui/sidebar";
import { db } from "@/lib/db";
import { activeGroupStore } from "@/lib/stores";
import { Button } from "./extendui/button";
import { Input } from "./extendui/input";

export function NavStudents() {
  // const { isMobile } = useSidebar();
  const activeGroup = useStore(activeGroupStore);
  const [showStudentEdit, setShowStudentEdit] = useState<Record<number, boolean>>({});
  const [studentNames, setStudentNames] = useState<Record<number, string>>({});

  const inputRef = useRef(null);

  useEffect(() => {
    if (showStudentEdit) {
    }
    // Focus the input when the component mounts
    if (inputRef.current) {
      // @ts-ignore
      inputRef.current?.focus();
    }
  }, [showStudentEdit]); // Empty dependency array ensures this runs only once on mount

  const students = useLiveQuery(
    async () => {
      //
      // Query Dexie's API
      //
      const friends = await db.students
        .where("group_id")
        .equals(activeGroup?.id ?? 0)
        .toArray();

      // Return result
      return friends;
    },
    // specify vars that affect query:
    [activeGroup],
  );

  useEffect(() => {
    if (students) {
      setShowStudentEdit(
        students.reduce(
          (acc, student) => {
            acc[student.id] = false;
            return acc;
          },
          {} as Record<string, boolean>,
        ),
      );
      setStudentNames(
        students.reduce(
          (acc, student) => {
            acc[student.id] = student.name;
            return acc;
          },
          {} as Record<string, string>,
        ),
      );
    }
  }, [students]);

  if (!students) return null;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Students</SidebarGroupLabel>
      <SidebarMenu>
        {students.length > 0 &&
          students.map((student) => (
            <SidebarMenuItem key={`student_${student.id}`}>
              {showStudentEdit[student.id] ? (
                <div>
                  <Input
                    className="h-8"
                    ref={inputRef}
                    id={`input${student.id}`}
                    onBlur={() => {
                      setStudentNames({ ...studentNames, [student.id]: student.name });
                      setShowStudentEdit({
                        ...showStudentEdit,
                        [student.id]: false,
                      });
                    }}
                    value={studentNames[student.id]}
                    onChange={(e) => setStudentNames({ ...studentNames, [student.id]: e.target.value })}
                    onKeyDown={async (event) => {
                      if (event.key === "Enter") {
                        if (!studentNames[student.id]) {
                          alert("Name cannot be empty");
                          return;
                        }
                        // updating the student name
                        await db.students.update(student.id, { name: studentNames[student.id] });
                        setShowStudentEdit({
                          ...showStudentEdit,
                          [student.id]: false,
                        });
                      }
                    }}
                  >
                    <Input.Group className="items-center">
                      <Input.LeftIcon>
                        <UserIcon className="w-4 h-4" />
                      </Input.LeftIcon>
                    </Input.Group>
                  </Input>
                </div>
              ) : (
                <div>
                  {" "}
                  <SidebarMenuButton
                    className="flex items-center justify-between"
                    onDoubleClick={() => {
                      setShowStudentEdit({
                        ...showStudentEdit,
                        [student.id]: true,
                      });
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>{student.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-6 h-6"
                      size="icon"
                      onClick={async () => {
                        await db.students.delete(student.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </SidebarMenuButton>
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem
                        onClick={async () => {
                          await db.students.delete(student.id);
                        }}
                      >
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete Student</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </div>
              )}
            </SidebarMenuItem>
          ))}
        {students.length === 0 && (
          <div className="flex items-center justify-center text-sm text-muted-foreground h-24 border-dashed border rounded-md">
            There are no students!
          </div>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
