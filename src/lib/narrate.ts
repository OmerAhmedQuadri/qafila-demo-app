// Placeholder narration using the device's built-in voice.
// In the real product this is replaced by Media Plus's recorded voice-over.
// Arabic is never read by text-to-speech: it would be mispronounced.
import { useStore } from "../state/store";

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

/** Reads text aloud. Returns false when it can't (sound switched off, or no speech support). */
export function speak(text: string): boolean {
  try {
    if (!useStore.getState().sound || typeof speechSynthesis === "undefined") return false;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = 0.92;
    u.pitch = 1.05;
    speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking() {
  try {
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}

// Turning sound off stops the voice mid-sentence too, not only new lines.
const unsubscribe = useStore.subscribe((s, prev) => {
  if (prev.sound && !s.sound) stopSpeaking();
});

// Dev only: a hot reload must not leave the old module's voice running.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    unsubscribe();
    stopSpeaking();
  });
}
