"use server";

import { db } from "@/lib/db";
import { notebooks } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import {
  createNotebookSchema,
  updateNotebookSchema,
  type CreateNotebookInput,
  type UpdateNotebookInput,
} from "@/lib/validations/notebook";

export async function getNotebooks() {
  try {
    const data = await db
      .select()
      .from(notebooks)
      .orderBy(desc(notebooks.createdAt));
    return { data };
  } catch (error) {
    console.error("Error fetching notebooks:", error);
    return { error: "Failed to fetch notebooks" };
  }
}

export async function createNotebook({ title }: CreateNotebookInput) {
  try {
    const validatedFields = createNotebookSchema.safeParse({ title });
    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }
    const [notebook] = await db
      .insert(notebooks)
      .values({ title: validatedFields.data.title })
      .returning();
    return { data: notebook };
  } catch (error) {
    console.error("Error creating notebook:", error);
    return { error: "Failed to create notebook" };
  }
}

export async function deleteNotebook({ id }: { id: string }) {
  try {
    await db.delete(notebooks).where(eq(notebooks.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting notebook:", error);
    return { error: "Failed to delete notebook" };
  }
}

export async function updateNotebook({ id, title }: UpdateNotebookInput) {
  try {
    const validatedFields = updateNotebookSchema.safeParse({ id, title });
    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }
    const [notebook] = await db
      .update(notebooks)
      .set({ title: validatedFields.data.title })
      .where(eq(notebooks.id, validatedFields.data.id))
      .returning();
    return { data: notebook };
  } catch (error) {
    console.error("Error updating notebook:", error);
    return { error: "Failed to update notebook" };
  }
}
