function friendly(status: number, text: string) {
  if (status === 429) return "The voice service is busy. Please try again in a moment.";
  return text || `Voice request failed (${status}).`;
}

/** Generates spoken audio with Groq TTS and plays it in the browser. */
export async function speak(
  text: string,
  sessionAudio?: { context: AudioContext; destination: MediaStreamAudioDestinationNode },
): Promise<void> {
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error(friendly(response.status, await response.text()));

  const bytes = await response.arrayBuffer();
  const context = sessionAudio?.context ?? new AudioContext();
  if (context.state === "suspended") await context.resume();

  const buffer = await context.decodeAudioData(bytes.slice(0));
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  if (sessionAudio) source.connect(sessionAudio.destination);

  await new Promise<void>((resolve, reject) => {
    source.onended = () => resolve();
    try {
      source.start();
    } catch (error) {
      reject(error);
    }
  });

  if (!sessionAudio) await context.close();
}

/** Sends a complete answer recording to Groq Whisper and returns its transcript. */
export async function transcribe(audio: Blob): Promise<string> {
  const form = new FormData();
  form.append("file", new File([audio], "answer.webm", { type: audio.type || "audio/webm" }));

  const response = await fetch("/api/stt", {
    method: "POST",
    body: form,
  });
  if (!response.ok) throw new Error(friendly(response.status, await response.text()));

  const payload = (await response.json()) as { text?: string };
  const text = payload.text?.trim();
  if (!text) throw new Error("Transcription was incomplete. Please try recording again.");
  return text;
}
