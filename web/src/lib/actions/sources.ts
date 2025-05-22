"use server";

import { db } from "@/lib/db";
import { sources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createSourceSchema } from "@/lib/validations/source";
import { env } from "@/env";
import { Source } from "../db/types";

export async function createSourceFile(formData: FormData): Promise<{
  error?: string;
  success: boolean;
  source?: Source;
}> {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const notebookId = formData.get("notebookId") as string;
  if (!notebookId) {
    return { error: "No notebookId provided", success: false };
  }

  if (file.type !== "application/pdf" && file.type !== "text/plain") {
    return { error: "Invalid file type", success: false };
  }

  // max 10 mb file size
  if (file.size > 10 * 1024 * 1024) {
    return { error: "File size too large", success: false };
  }

  // file as buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // create source in db
  const validatedData = createSourceSchema.parse({
    notebookId,
    title: file.name,
    type: file.type,
  });

  try {
    const source = await db.transaction(async (tx) => {
      const [source] = await tx
        .insert(sources)
        .values(validatedData)
        .returning();

      // update vector store
      const uploadFormData = new FormData();
      uploadFormData.append(
        "file",
        new Blob([buffer], { type: file.type }),
        file.name
      );
      uploadFormData.append("notebookId", notebookId);
      uploadFormData.append("sourceId", source.id);

      console.log(`<<< ${env.AGENT_API_URL}/upload`);
      const res = await fetch(`${env.AGENT_API_URL}/upload`, {
        method: "POST",
        body: uploadFormData,
      });
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }
      return source;
    });
    return { success: true, source };
  } catch (error) {
    console.error("Error uploading source:", error);
    return { error: "Failed to upload source", success: false };
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
    await db.transaction(async (tx) => {
      await tx.delete(sources).where(eq(sources.id, id));
      const res = await fetch(`${env.AGENT_API_URL}/documents/sources/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Failed to delete source: ${res.statusText}`);
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting source:", error);
    return { error: "Failed to delete source" };
  }
}
