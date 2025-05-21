"use client";

import { cn } from "@/lib/utils";
import { Message } from "ai";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4 rounded-lg",
        message.role === "assistant" ? "bg-muted" : "bg-background border"
      )}
    >
      <div className="flex-shrink-0">
        {message.role === "assistant" ? (
          <Bot className="h-6 w-6 text-primary" />
        ) : (
          <User className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="prose prose-sm dark:prose-invert">
          {message.content}
        </div>
      </div>
    </div>
  );
}
