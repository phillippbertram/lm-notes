import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotebookCard } from "@/components/notebook-card";
import { getNotebooks } from "@/lib/actions/notebooks";
import { CreateNotebookDialog } from "@/components/create-notebook-dialog";

export default async function Home() {
  const { data: notebooks, error } = await getNotebooks();

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Failed to load notebooks</p>
      </div>
    );
  }

  return (
    <div className="container py-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Notebooks</h1>
        <CreateNotebookDialog>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Notebook
          </Button>
        </CreateNotebookDialog>
      </div>

      {!notebooks || notebooks.length === 0 ? (
        <div className="flex h-[calc(100vh-16rem)] items-center justify-center">
          <p className="text-muted-foreground">No notebooks yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notebooks.map((notebook) => (
            <NotebookCard key={notebook.id} notebook={notebook} />
          ))}
        </div>
      )}
    </div>
  );
}
