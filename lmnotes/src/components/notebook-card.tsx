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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  deleteNotebook,
  NoteBootWithSourceCount,
  updateNotebook,
} from "@/lib/actions/notebooks";
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

const EMOJI_SUGGESTIONS = [
  "📝",
  "📚",
  "📖",
  "📓",
  "📔",
  "📒",
  "📑",
  "🔖",
  "📌",
  "📍",
  "📎",
  "📐",
  "✏️",
  "📏",
  "🖊️",
  "🖋️",
  "✒️",
  "🖌️",
  "🖍️",
  "📝",
  "✏️",
  "🔍",
  "🔎",
  "💡",
  "💭",
  "💬",
  "🗣️",
  "👥",
  "👤",
  "🧠",
  "🎯",
  "🎨",
];

interface NotebookCardProps {
  notebook: NoteBootWithSourceCount;
}

export function NotebookCard({ notebook }: NotebookCardProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(notebook.title);
  const [newEmoji, setNewEmoji] = useState(notebook.emoji);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [notebookToDelete, setNotebookToDelete] = useState<Notebook | null>(
    null
  );

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await updateNotebook({
        id: notebook.id,
        title: newTitle,
        emoji: newEmoji,
      });
      if (error) throw new Error(error);

      setIsRenameOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to rename notebook:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotebook = async () => {
    if (!notebookToDelete) return;

    try {
      const result = await deleteNotebook(notebookToDelete.id);
      if (result.error) {
        console.error("Failed to delete notebook:", result.error);
      }
    } catch (error) {
      console.error("Error deleting notebook:", error);
    } finally {
      setNotebookToDelete(null);
    }
  };

  return (
    <>
      <Link href={`/notebook/${notebook.id}`} className="block">
        <Card className="w-full hover:bg-accent/50 transition-colors">
          <CardHeader className="flex flex-col space-y-0">
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
            <CardTitle className="text-xl font-bold line-clamp-2">
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

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notebook</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRename} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Emoji</label>
              <div className="grid grid-cols-8 gap-2 p-2 border rounded-md">
                {EMOJI_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setNewEmoji(suggestion)}
                    className={`p-2 text-xl rounded-md hover:bg-accent ${
                      newEmoji === suggestion ? "bg-accent" : ""
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter notebook title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRenameOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
