import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

const MODEL = "gpt-5";
const BASE_URL = process.env["OPENAI_BASE_URL"];


export async function generateProbeText(
  instructions: string,
  messages: ModelMessage[],
): Promise<string> {
  const apiKey = process.env["OPENAI_API_KEY"];
  if (!apiKey || !BASE_URL) throw new Error("AI is not configured for this app yet.");

  const provider = createOpenAI({ baseURL: BASE_URL, apiKey });

  const result = streamText({
    model: provider.responses(MODEL),
    instructions,
    messages,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "medium",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return (await result.text).trim();
}
