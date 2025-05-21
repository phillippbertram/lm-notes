"use client";

import { FileTextIcon, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Notebook, Source } from "@/lib/db/types";
import { AddSourceDialog } from "@/components/add-source-dialog";
import { createSource, getSources } from "@/lib/actions/sources";
import { toast } from "sonner";

interface NotebookLayoutProps {
  notebook: Notebook;
}

export function NotebookLayout({ notebook }: NotebookLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const panelRef = useRef<any>(null);

  useEffect(() => {
    loadSources();
  }, [notebook.id]);

  const loadSources = async () => {
    const { data, error } = await getSources(notebook.id);
    if (error) {
      toast.error("Failed to load sources");
      return;
    }
    setSources(data || []);
  };

  const handleAddSource = async (file: File) => {
    try {
      // const content = await file.text();
      const { data, error } = await createSource({
        notebookId: notebook.id,
        title: file.name,
        type: file.type === "application/pdf" ? "pdf" : "txt",
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Source added successfully");
      await loadSources();
    } catch (error) {
      console.error("Error adding source:", error);
      toast.error("Failed to add source");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          ref={panelRef}
          defaultSize={20}
          minSize={15}
          maxSize={30}
          collapsible
          collapsedSize={6}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
        >
          <div className="flex h-full flex-col bg-muted/40">
            <div
              className={cn(
                "flex items-center justify-between p-4 border-b",
                isCollapsed && "justify-center"
              )}
            >
              {!isCollapsed && <h2 className="font-semibold">Sources</h2>}
              <div className="flex gap-2">
                {!isCollapsed && (
                  <AddSourceDialog onAddSource={handleAddSource} />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (isCollapsed) {
                      panelRef.current?.expand();
                    } else {
                      panelRef.current?.collapse();
                    }
                  }}
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className={cn(
                      "flex items-center gap-2 rounded-md hover:bg-muted cursor-pointer",
                      isCollapsed ? "justify-center p-3" : "p-2"
                    )}
                  >
                    <FileTextIcon
                      className={cn(
                        "text-muted-foreground",
                        isCollapsed ? "h-6 w-6" : "h-4 w-4"
                      )}
                    />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {source.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(source.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80}>
          {/* Chat Area */}
          <div className="flex h-full flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b">
              <h1 className="text-xl font-semibold">{notebook.title}</h1>
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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
