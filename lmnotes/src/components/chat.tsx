"use client";

import { Notebook, Source } from "@/lib/db/types";
import {
  AssistantRuntimeProvider,
  ChatModelAdapter,
  useLocalRuntime,
} from "@assistant-ui/react";
import { Thread } from "@/components/assistant-ui/thread";

const MyModelAdapter = (notebookId: string): ChatModelAdapter => {
  return {
    async run({ messages, abortSignal }) {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, notebookId }),
        signal: abortSignal,
      });

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: data.text,
          },
        ],
      };
    },
  };
};

interface ChatProps {
  notebook: Notebook;
  sources: Source[];
}

export function Chat({ notebook, sources }: ChatProps) {
  const runtime = useLocalRuntime(MyModelAdapter(notebook.id));
  // const { messages, input, handleInputChange, handleSubmit, isLoading } =
  //   useChat({
  //     initialMessages: [
  //       {
  //         id: "welcome",
  //         role: "assistant",
  //         content:
  //           "Hello! I'm your AI assistant. I can help you understand your sources. What would you like to know?",
  //       } as Message,
  //     ],
  //   });

  // return (
  //   <div className="flex h-full flex-col">
  //     {/* Chat Messages */}
  //     <div className="flex-1 overflow-y-auto p-4">
  //       <div className="max-w-3xl mx-auto space-y-4">
  //         {messages.map((message) => (
  //           <ChatMessage key={message.id} message={message} />
  //         ))}
  //       </div>
  //     </div>

  //     {/* Chat Input */}
  //     <div className="p-4 border-t">
  //       <div className="max-w-3xl mx-auto">
  //         <form onSubmit={handleSubmit} className="relative">
  //           <ChatInput
  //             value={input}
  //             onChange={handleInputChange}
  //             isLoading={isLoading}
  //           />
  //         </form>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  );
}
