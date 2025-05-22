import { NotebookCard } from "@/components/notebook-card";
import { getNotebooks } from "@/lib/actions/notebooks";
import { NotebookDialog } from "@/components/notebook-dialog";

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
    <div className="container py-6 px-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Notebooks</h1>
        <NotebookDialog />
      </div>

      {!notebooks || notebooks.length === 0 ? (
        <div className="flex h-[calc(100vh-16rem)] items-center justify-center">
          <p className="text-muted-foreground">No notebooks yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
          {notebooks.map((notebook) => (
            <NotebookCard key={notebook.id} notebook={notebook} />
          ))}
        </div>
      )}
    </div>
  );
}
