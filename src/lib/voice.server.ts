const GROQ_API = "https://api.groq.com/openai/v1";
const TTS_MODEL = "canopylabs/orpheus-v1-english";
const TTS_VOICE = "troy";
const STT_MODEL = "whisper-large-v3";
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;

function apiKey() {
  const key = process.env["GROQ_API_KEY"];
  if (!key) throw new Error("Voice AI is not configured for this app yet.");
  return key;
}

export async function requestSpeech(text: string) {
  return fetch(`${GROQ_API}/audio/speech`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: text.slice(0, 200),
      response_format: "wav",
    }),
  });
}

export async function requestTranscription(file: File) {
  if (!file.size || file.size > MAX_AUDIO_BYTES) {
    throw new Error("That answer is too long to transcribe. Please keep answers under about 10 minutes.");
  }
  const form = new FormData();
  form.append("model", STT_MODEL);
  form.append("file", file);
  form.append("response_format", "json");
  form.append("language", "en");
  return fetch(`${GROQ_API}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey()}` },
    body: form,
  });
}
