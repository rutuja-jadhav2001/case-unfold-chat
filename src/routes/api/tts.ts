import { createFileRoute } from "@tanstack/react-router";
import { requestSpeech } from "@/lib/voice.server";

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as { text?: unknown } | null;
        const text = typeof body?.text === "string" ? body.text.trim() : "";
        if (!text) return new Response("Missing text", { status: 400 });
        const upstream = await requestSpeech(text);
        return new Response(upstream.body, {
          status: upstream.status,
          headers: {
            "Content-Type": upstream.headers.get("content-type") ?? "audio/wav",
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
