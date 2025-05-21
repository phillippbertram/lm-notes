"use server";

import { db } from "@/lib/db";
import { sources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Source, NewSource } from "@/lib/db/types";
import {
  createSourceSchema,
  type CreateSourceInput,
} from "@/lib/validations/source";
import { z } from "zod";

export async function createSource(input: CreateSourceInput) {
  try {
    const validatedData = createSourceSchema.parse(input);
    const [source] = await db.insert(sources).values(validatedData).returning();
    return { data: source };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error("Error creating source:", error);
    return { error: "Failed to create source" };
  }
}

export async function getSources(notebookId: string) {
  try {
    const data = await db
      .select()
      .from(sources)
      .where(eq(sources.notebookId, notebookId))
      .orderBy(sources.createdAt);
    return { data };
  } catch (error) {
    console.error("Error fetching sources:", error);
    return { error: "Failed to fetch sources" };
  }
}

export async function deleteSource(id: string) {
  try {
    await db.delete(sources).where(eq(sources.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting source:", error);
    return { error: "Failed to delete source" };
  }
}
