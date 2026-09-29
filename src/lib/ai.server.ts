import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

const MODEL = "openai/gpt-oss-120b";
const BASE_URL = "https://api.groq.com/openai/v1";

export async function generateProbeText(
  instructions: string,
  messages: ModelMessage[],
): Promise<string> {
  const apiKey = process.env["GROQ_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this app yet.");

  const provider = createOpenAI({ baseURL: BASE_URL, apiKey });

  const result = streamText({
    model: provider.chat(MODEL),
    system: instructions,
    messages,
    temperature: 0.3,
  });

  return (await result.text).trim();
}
