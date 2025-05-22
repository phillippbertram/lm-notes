"use client";

import { FileTextIcon, PanelLeft, MoreVertical, Trash2 } from "lucide-react";
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
import {
  createSourceFile,
  getSources,
  deleteSource,
} from "@/lib/actions/sources";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Chat } from "@/components/chat";

interface NotebookLayoutProps {
  notebook: Notebook;
}

export function NotebookLayout({ notebook }: NotebookLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [sourceToDelete, setSourceToDelete] = useState<Source | null>(null);
  const panelRef = useRef<any>(null);

  useEffect(() => {
    loadSources();
  }, [notebook.id]);

  const loadSources = async () => {
    const { data, error } = await getSources(notebook.id);
    if (error) {
      console.error("Failed to load sources:", error);
      return;
    }
    setSources(data || []);
  };

  const handleAddSource = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("notebookId", notebook.id);
      formData.append("file", file);
      const { error } = await createSourceFile(formData);

      if (error) {
        console.error(error);
        return;
      }

      await loadSources();
    } catch (error) {
      console.error("Error adding source:", error);
    }
  };

  const handleDeleteSource = async () => {
    if (!sourceToDelete) return;

    const { error } = await deleteSource(sourceToDelete.id);
    if (error) {
      console.error("Failed to delete source:", error);
      return;
    }

    await loadSources();
    setSourceToDelete(null);
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
                "flex items-center justify-between p-3 border-b",
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
                      "group flex items-center gap-2 rounded-md hover:bg-muted cursor-pointer",
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
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {source.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(source.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setSourceToDelete(source)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
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

            <Chat notebook={notebook} sources={sources} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <AlertDialog
        open={!!sourceToDelete}
        onOpenChange={() => setSourceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Source</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this source? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSource}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
