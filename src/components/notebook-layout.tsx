"use client";

import { FileTextIcon, PlusIcon, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Notebook } from "@/lib/db/types";

interface NotebookLayoutProps {
  notebook: Notebook;
}

export function NotebookLayout({ notebook }: NotebookLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const panelRef = useRef<any>(null);

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
                  <Button variant="ghost" size="icon">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
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
                {/* Sources will be added here */}
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
