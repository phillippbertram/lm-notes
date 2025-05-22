import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const id = uuid("id").defaultRandom().primaryKey();
const createdAt = timestamp("created_at").defaultNow().notNull();
const updatedAt = timestamp("updated_at").defaultNow().notNull();
const timestamps = { createdAt, updatedAt };

export const notebooks = pgTable("notebooks", {
  id,
  title: text("title").notNull(),
  emoji: text("emoji").notNull().default("📝"),
  ...timestamps,
});

export const sources = pgTable("sources", {
  id,
  notebookId: uuid("notebook_id")
    .references(() => notebooks.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  content: text("content"),
  ...timestamps,
});

export const notebookRelations = relations(notebooks, ({ many }) => ({
  sources: many(sources),
}));

export const sourceRelations = relations(sources, ({ one }) => ({
  notebook: one(notebooks, {
    fields: [sources.notebookId],
    references: [notebooks.id],
  }),
}));
