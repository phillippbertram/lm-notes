import { getNotebook } from "@/lib/actions/notebooks";
import { notFound } from "next/navigation";
import { NotebookLayout } from "@/components/notebook-layout";
import { Notebook } from "@/lib/db/types";

export default async function NotebookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: notebook, error } = await getNotebook(id);

  if (error) {
    notFound();
  }

  // We know notebook exists when there's no error
  const notebookData = notebook as Notebook;

  return <NotebookLayout notebook={notebookData} />;
}
