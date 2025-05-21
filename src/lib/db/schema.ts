import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  uuid,
} from "drizzle-orm/pg-core";

const id = uuid("id").primaryKey();
const createdAt = timestamp("created_at").defaultNow().notNull();
const updatedAt = timestamp("updated_at").defaultNow().notNull();
const timestamps = { createdAt, updatedAt };

export const notebooks = pgTable("notebooks", {
  id,
  title: text("title").notNull(),
  ...timestamps,
});

export const sources = pgTable("sources", {
  id,
  notebookId: uuid("notebook_id")
    .references(() => notebooks.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  ...timestamps,
});
