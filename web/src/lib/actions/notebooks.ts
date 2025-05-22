"use server";

import { db } from "@/lib/db";
import { notebooks } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Notebook } from "@/lib/db/types";
import {
  createNotebookSchema,
  updateNotebookSchema,
  type CreateNotebookInput,
  type UpdateNotebookInput,
} from "@/lib/validations/notebook";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export type NoteBootWithSourceCount = Notebook & {
  sourceCount: number;
};

export async function getNotebooks(): Promise<{
  data?: NoteBootWithSourceCount[];
  error?: string | null;
}> {
  try {
    const data = await db.query.notebooks.findMany({
      with: {
        sources: {
          // TODO: would be better to just "count" sources
          columns: {
            id: true,
          },
        },
      },
      orderBy: [desc(notebooks.createdAt)],
    });

    const notebooksWithSourceCount = data.map((notebook) => ({
      ...notebook,
      sourceCount: notebook.sources?.length ?? 0,
    }));

    return { data: notebooksWithSourceCount };
  } catch (error) {
    console.error("Error fetching notebooks:", error);
    return { error: "Failed to fetch notebooks" };
  }
}

export async function getNotebook(id: string) {
  try {
    const [notebook] = await db
      .select()
      .from(notebooks)
      .where(eq(notebooks.id, id))
      .limit(1);

    if (!notebook) {
      return { error: "Notebook not found" };
    }

    return { data: notebook };
  } catch (error) {
    console.error("Error fetching notebook:", error);
    return { error: "Failed to fetch notebook" };
  }
}

export async function createNotebook(input: CreateNotebookInput) {
  try {
    const validatedData = createNotebookSchema.parse(input);
    const [notebook] = await db
      .insert(notebooks)
      .values(validatedData)
      .returning();
    revalidatePath("/");
    return { data: notebook };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error("Error creating notebook:", error);
    return { error: "Failed to create notebook" };
  }
}

export async function deleteNotebook(id: string) {
  try {
    await db.delete(notebooks).where(eq(notebooks.id, id));
    revalidatePath("/notebook");
    return { success: true };
  } catch (error) {
    console.error("Error deleting notebook:", error);
    return {
      error: "Failed to delete notebook",
    };
  }
}

export async function updateNotebook(input: UpdateNotebookInput) {
  try {
    const validatedData = updateNotebookSchema.parse(input);
    const [notebook] = await db
      .update(notebooks)
      .set({
        title: validatedData.title,
        emoji: validatedData.emoji,
        updatedAt: new Date(),
      })
      .where(eq(notebooks.id, validatedData.id))
      .returning();
    return { data: notebook };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error("Error updating notebook:", error);
    return { error: "Failed to update notebook" };
  }
}
