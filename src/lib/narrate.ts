// Placeholder narration using the device's built-in voice.
// In the real product this is replaced by Media Plus's recorded voice-over.
// Arabic is never read by text-to-speech: it would be mispronounced.

let preferred: SpeechSynthesisVoice | null = null;

function pickVoice() {
  if (preferred || typeof speechSynthesis === "undefined") return preferred;
  const voices = speechSynthesis.getVoices();
  preferred =
    voices.find((v) => /en-IN/i.test(v.lang)) ||
    voices.find((v) => /en-GB/i.test(v.lang) && /female|libby|sonia|google/i.test(v.name)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    null;
  return preferred;
}

export function speak(text: string) {
  try {
    if (typeof speechSynthesis === "undefined") return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = 0.92;
    u.pitch = 1.05;
    speechSynthesis.speak(u);
  } catch {
    /* speech not available */
  }
}

export function stopSpeaking() {
  try {
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}
