"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreVertical, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteNotebook } from "@/lib/actions/notebooks";
import { Notebook } from "@/lib/db/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotebookDialog } from "@/components/notebook-dialog";

interface NotebookWithSourceCount extends Notebook {
  sourceCount: number;
}

interface NotebookCardProps {
  notebook: NotebookWithSourceCount;
}

export function NotebookCard({ notebook }: NotebookCardProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const router = useRouter();
  const [notebookToDelete, setNotebookToDelete] = useState<Notebook | null>(
    null
  );

  const handleDeleteNotebook = async () => {
    if (!notebookToDelete) return;

    try {
      const result = await deleteNotebook(notebookToDelete.id);
      if (result.error) {
        console.error("Failed to delete notebook:", result.error);
      }
      router.refresh();
    } catch (error) {
      console.error("Error deleting notebook:", error);
    } finally {
      setNotebookToDelete(null);
    }
  };

  return (
    <>
      <Link href={`/notebook/${notebook.id}`} className="block h-full">
        <Card className="w-full h-full hover:bg-accent/50 transition-colors">
          <CardHeader className="flex flex-col space-y-0 h-[150px]">
            <div className="flex flex-row items-center justify-between w-full pb-4">
              <span className="text-5xl">{notebook.emoji}</span>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.preventDefault()}
                >
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      setIsRenameOpen(true);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={(e) => {
                      e.preventDefault();
                      setNotebookToDelete(notebook);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardTitle className="text-xl font-bold line-clamp-2 flex-grow">
              {notebook.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs space-x-1">
              <span>
                {new Date(notebook.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="font-bold">·</span>
              <span>{notebook.sourceCount} sources</span>
            </CardDescription>
          </CardContent>
        </Card>
      </Link>

      <NotebookDialog
        notebook={notebook}
        open={isRenameOpen}
        onOpenChange={setIsRenameOpen}
      />

      <AlertDialog
        open={!!notebookToDelete}
        onOpenChange={(open) => !open && setNotebookToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              notebook and all its sources.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNotebook}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
