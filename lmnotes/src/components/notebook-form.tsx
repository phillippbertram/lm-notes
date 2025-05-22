"use client";

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
import { createNotebook } from "@/lib/actions/notebooks";
import { Plus } from "lucide-react";
import { useState } from "react";

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

export function NotebookForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("📝");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createNotebook({
        title,
        emoji,
      });
      if (result.error) {
        throw new Error(result.error);
      }

      setTitle("");
      setEmoji("📝");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create notebook:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Notebook
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Notebook</DialogTitle>
          <DialogDescription>
            Add a new notebook to organize your sources and notes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Emoji</label>
            <div className="grid grid-cols-8 gap-2 p-2 border rounded-md">
              {EMOJI_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setEmoji(suggestion)}
                  className={`p-2 text-xl rounded-md hover:bg-accent ${
                    emoji === suggestion ? "bg-accent" : ""
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Notebook"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
