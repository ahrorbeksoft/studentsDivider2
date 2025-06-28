import { Store } from "@tanstack/react-store";
import type { Group, Student } from "./db";

export const activeGroupStore = new Store<Group>(null as unknown as Group);
export const activeEditGroupStore = new Store<Group | null>(null);
export const groupsStore = new Store<Group[]>([]);
export const studentsStore = new Store<Student[]>([]);
export const isLoadedStore = new Store<boolean>(false);
export const showStudentForm = new Store<boolean>(false);
export const activeEditStudentStore = new Store<Student | null>(null);
export const groupDialogStore = new Store<boolean>(false);
