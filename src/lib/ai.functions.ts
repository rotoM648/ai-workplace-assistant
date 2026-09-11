import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GenerateInput = z.object({
  instructions: z.string().min(1),
  prompt: z.string().min(1),
});

async function callGateway(instructions: string, prompt: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured. Missing API key.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      reasoning: { effort: "low" },
      instructions,
      input: prompt,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) {
      throw new Error("Too many requests right now. Please try again in a moment.");
    }
    if (res.status === 402) {
      throw new Error("AI credits are exhausted. Please add credits to continue.");
    }
    throw new Error(`AI request failed (${res.status}). ${text.slice(0, 300)}`);
  }

  const data: unknown = await res.json();
  return extractText(data);
}

function extractText(data: unknown): string {
  const d = data as {
    output_text?: string | string[];
    output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
  };
  if (typeof d.output_text === "string" && d.output_text.trim()) return d.output_text;
  if (Array.isArray(d.output_text)) return d.output_text.join("\n");
  const parts: string[] = [];
  for (const item of d.output ?? []) {
    if (item.type && item.type !== "message") continue;
    for (const c of item.content ?? []) {
      if (typeof c.text === "string") parts.push(c.text);
    }
  }
  const joined = parts.join("\n").trim();
  if (!joined) throw new Error("The AI returned an empty response. Please try again.");
  return joined;
}

export const generateAiText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const text = await callGateway(data.instructions, data.prompt);
    return { text };
  });
