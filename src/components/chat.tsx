"use client";

import { Source } from "@/lib/db/types";
import { useChat } from "@ai-sdk/react";
import { Message } from "ai";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";

interface ChatProps {
  sources: Source[];
}

export function Chat({ sources }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hello! I'm your AI assistant. I can help you understand your sources. What would you like to know?",
        } as Message,
      ],
    });

  return (
    <div className="flex h-full flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <ChatInput
              value={input}
              onChange={handleInputChange}
              isLoading={isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
