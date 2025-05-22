import { NextResponse } from "next/server";
import { z } from "zod";

// export const runtime = "edge";
// export const maxDuration = 300; // seconds

// export async function POST(req: Request) {
//   const { messages, system, tools } = await req.json();

//   const result = streamText({
//     model: openai("gpt-4o"),
//     messages,
//     toolCallStreaming: true,
//     system,
//     tools: {
//       ...frontendTools(tools),
//       // add backend tools here
//     },
//   });

//   return result.toDataStreamResponse();
// }
// Sicherstellen, dass die Route nicht statisch vorgerendert oder gecacht wird:
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Node-Umgebung für volle Stream-Unterstützung

const ChatRequestSchema = z.object({
  id: z.string().optional(),
  messages: z.array(
    z.object({
      role: z.string(),
      content: z.array(z.object({ type: z.string(), text: z.string() })),
    })
  ),
  notebookId: z.string(),
});

// TODO: streaming the response somehow will not work
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedBody = ChatRequestSchema.parse(body);

    // const result = streamText({
    //   model: openai("gpt-4o-mini"),
    //   messages: validatedBody.messages.map((m) => {
    //     return {
    //       role: m.role as "user" | "assistant" | "system",
    //       content: m.content.map((c) => c.text).join("\n"),
    //     };
    //   }),
    // });
    // return result.toDataStreamResponse();

    const upstream = await fetch("http://localhost:8000/chat", {
      method: "POST",
      signal: req.signal,
      headers: {
        "Content-Type": "application/json",
        // Accept: "text/event-stream",
      },
      body: JSON.stringify(validatedBody),
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: "No response body" }, { status: 500 });
    }

    const returnedMessage = await upstream.text();
    console.log(returnedMessage);

    return new Response(
      JSON.stringify({
        content: [
          {
            type: "text",
            text: returnedMessage,
          },
        ],
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );

    // return new NextResponse(JSON.stringify(returnMessage), {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
