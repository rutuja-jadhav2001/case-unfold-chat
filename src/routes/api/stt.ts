import { createFileRoute } from "@tanstack/react-router";
import { requestTranscription } from "@/lib/voice.server";

export const Route = createFileRoute("/api/stt")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const form = await request.formData().catch(() => null);
        const file = form?.get("file");
        if (!(file instanceof File)) return new Response("Missing audio", { status: 400 });
        try {
          const upstream = await requestTranscription(file);
          return new Response(upstream.body, {
            status: upstream.status,
            headers: {
              "Content-Type": upstream.headers.get("content-type") ?? "application/json",
              "Cache-Control": "no-store",
            },
          });
        } catch (e) {
          return new Response(e instanceof Error ? e.message : "Transcription failed", { status: 400 });
        }
      },
    },
  },
});
