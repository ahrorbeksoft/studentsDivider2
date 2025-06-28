// db.ts
import Dexie, { type EntityTable } from "dexie";

interface Student {
  id: number;
  name: string;
  group_id: number;
}

interface Group {
  id: number;
  name: string;
}

const db = new Dexie("database") as Dexie & {
  students: EntityTable<
    Student,
    "id" // primary key "id" (for the typings only)
  >;
  groups: EntityTable<
    Group,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  students: "++id, name, group_id", // primary key "id" (for the runtime!)
  groups: "++id, name",
});

export type { Student, Group };
export { db };
