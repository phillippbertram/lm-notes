import { z } from "zod";

export const createSourceSchema = z.object({
  notebookId: z.string().uuid(),
  title: z.string().min(1).max(255),
  type: z.enum(["application/pdf", "text/plain"]),
});

export type CreateSourceInput = z.infer<typeof createSourceSchema>;
