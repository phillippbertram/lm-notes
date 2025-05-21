"use client";

import { FileTextIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for sources - replace with actual data later
const sources = [
  {
    id: 1,
    title: "Project Requirements",
    type: "document",
    lastModified: "2024-03-20",
  },
  {
    id: 2,
    title: "Research Paper",
    type: "document",
    lastModified: "2024-03-19",
  },
];

export default function NotebookPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sources Panel */}
      <div className="w-80 border-r bg-muted/40">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Sources</h2>
            <Button variant="ghost" size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
              >
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{source.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {source.lastModified}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">Chat</h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center text-muted-foreground">
              Start a conversation about your sources
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                placeholder="Ask a question about your sources..."
                className="w-full resize-none rounded-lg border bg-background px-4 py-3 pr-12 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                rows={1}
              />
              <Button
                size="icon"
                className="absolute right-2 bottom-2.5"
                variant="ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
