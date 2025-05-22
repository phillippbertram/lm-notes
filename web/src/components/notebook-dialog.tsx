"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createNotebook, updateNotebook } from "@/lib/actions/notebooks";
import { Notebook } from "@/lib/db/types";
import { useRouter } from "next/navigation";
import { EmojiPicker } from "@/components/emoji-picker";

interface NotebookDialogProps {
  notebook?: Notebook;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function NotebookDialog({
  notebook,
  open,
  onOpenChange,
  trigger,
}: NotebookDialogProps) {
  const [isOpen, setIsOpen] = useState(open ?? false);
  const [title, setTitle] = useState(notebook?.title ?? "");
  const [emoji, setEmoji] = useState(notebook?.emoji ?? "📝");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  useEffect(() => {
    if (notebook) {
      setTitle(notebook.title);
      setEmoji(notebook.emoji);
    }
  }, [notebook]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (notebook) {
        const result = await updateNotebook({
          id: notebook.id,
          title,
          emoji,
        });
        if (result.error) throw new Error(result.error);
      } else {
        const result = await createNotebook({
          title,
          emoji,
        });
        if (result.error) throw new Error(result.error);
      }

      setTitle("");
      setEmoji("📝");
      handleOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to save notebook:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      New Notebook
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!notebook && (
        <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {notebook ? "Edit Notebook" : "Create New Notebook"}
          </DialogTitle>
          <DialogDescription>
            {notebook
              ? "Edit your notebook to organize your sources and notes."
              : "Add a new notebook to organize your sources and notes."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <EmojiPicker selectedEmoji={emoji} onEmojiSelect={setEmoji} />
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder="Enter notebook title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : notebook
                ? "Save Changes"
                : "Create Notebook"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
