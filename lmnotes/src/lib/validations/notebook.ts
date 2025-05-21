import { z } from "zod";

export const createNotebookSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
});

export const updateNotebookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
});

export const deleteNotebookSchema = z.object({
  id: z.string().uuid(),
});

export type CreateNotebookInput = z.infer<typeof createNotebookSchema>;
export type UpdateNotebookInput = z.infer<typeof updateNotebookSchema>;
export type DeleteNotebookInput = z.infer<typeof deleteNotebookSchema>;
