export default function NotebookPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Notebook {params.id}</h1>
      <p className="text-muted-foreground">
        Notebook content will be displayed here.
      </p>
    </div>
  );
}
