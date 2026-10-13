// All sounds are synthesised with Web Audio: no files, no music.
// The demo follows a "voices & nature only" principle (soft chimes, wind, crickets).
import { useStore } from "../state/store";

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function ac(): AudioContext | null {
  if (!useStore.getState().sound) return null;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new Ctor();
      const len = ctx.sampleRate * 2;
      noise = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = noise.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        last = (last + 0.02 * w) / 1.02; // brown-ish noise
        d[i] = last * 3.5;
      }
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur = 0.25, delay = 0, type: OscillatorType = "sine", vol = 0.08) {
  const a = ac();
  if (!a) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function bell(freq: number, delay = 0, vol = 0.07) {
  [1, 2.01, 3.03].forEach((m, i) => tone(freq * m, 1.4 / (i + 1), delay, "sine", vol / (i * 2 + 1)));
}

function burst(filterFreq: number, type: BiquadFilterType, dur: number, vol: number, delay = 0) {
  const a = ac();
  if (!a || !noise) return;
  const t = a.currentTime + delay;
  const s = a.createBufferSource();
  s.buffer = noise;
  const f = a.createBiquadFilter();
  f.type = type;
  f.frequency.value = filterFreq;
  const g = a.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(a.destination);
  s.start(t, Math.random());
  s.stop(t + dur + 0.05);
}

export const sfx = {
  tap: () => tone(660, 0.12, 0, "triangle", 0.05),
  soft: () => tone(520, 0.18, 0, "sine", 0.06),
  correct: () => { bell(784); bell(1047, 0.12); },
  gentleNo: () => { tone(330, 0.22, 0, "triangle", 0.05); tone(294, 0.28, 0.12, "triangle", 0.045); },
  bead: () => { burst(1800, "bandpass", 0.06, 0.35); tone(1400, 0.05, 0, "triangle", 0.03); },
  setDone: () => [523, 659, 784, 1047].forEach((f, i) => bell(f, i * 0.14, 0.06)),
  celebrate: () => [523, 659, 784, 1047, 1319].forEach((f, i) => bell(f, i * 0.11, 0.07)),
  whoosh: () => burst(900, "bandpass", 0.5, 0.25),
  sand: () => burst(3000, "highpass", 0.3, 0.12),
  baa: () => {
    const a = ac();
    if (!a) return;
    const t = a.currentTime;
    const o = a.createOscillator();
    const lfo = a.createOscillator();
    const lg = a.createGain();
    const g = a.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(420, t);
    o.frequency.linearRampToValueAtTime(360, t + 0.45);
    lfo.frequency.value = 22;
    lg.gain.value = 18;
    lfo.connect(lg).connect(o.frequency);
    const f = a.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 1400;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.connect(f).connect(g).connect(a.destination);
    o.start(t); lfo.start(t);
    o.stop(t + 0.55); lfo.stop(t + 0.55);
  },
};

/* ---------- ambience (wind / night crickets) ---------- */
type Amb = { stop: () => void };
let current: Amb | null = null;
let currentKind: string | null = null;

export function ambience(kind: "wind" | "night" | null) {
  if (kind === currentKind) return;
  current?.stop();
  current = null;
  currentKind = kind;
  if (!kind) return;
  const a = ac();
  if (!a || !noise) return;
  const master = a.createGain();
  master.gain.setValueAtTime(0, a.currentTime);
  master.gain.linearRampToValueAtTime(1, a.currentTime + 1.5);
  master.connect(a.destination);

  const src = a.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const bp = a.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = kind === "wind" ? 500 : 350;
  bp.Q.value = 0.8;
  const wg = a.createGain();
  wg.gain.value = kind === "wind" ? 0.06 : 0.025;
  const lfo = a.createOscillator();
  const lg = a.createGain();
  lfo.frequency.value = 0.13;
  lg.gain.value = 220;
  lfo.connect(lg).connect(bp.frequency);
  src.connect(bp).connect(wg).connect(master);
  src.start();
  lfo.start();

  let timer: number | undefined;
  if (kind === "night") {
    const chirp = () => {
      const c = ac();
      if (!c) return;
      const t = c.currentTime;
      for (let i = 0; i < 3; i++) {
        const o = c.createOscillator();
        const g = c.createGain();
        o.frequency.value = 4200 + Math.random() * 300;
        g.gain.setValueAtTime(0, t + i * 0.07);
        g.gain.linearRampToValueAtTime(0.012, t + i * 0.07 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.05);
        o.connect(g).connect(master);
        o.start(t + i * 0.07);
        o.stop(t + i * 0.07 + 0.06);
      }
      timer = window.setTimeout(chirp, 900 + Math.random() * 1600);
    };
    timer = window.setTimeout(chirp, 600);
  }

  current = {
    stop: () => {
      window.clearTimeout(timer);
      try {
        master.gain.cancelScheduledValues(a.currentTime);
        master.gain.setValueAtTime(master.gain.value, a.currentTime);
        master.gain.linearRampToValueAtTime(0, a.currentTime + 0.6);
        window.setTimeout(() => { try { src.stop(); lfo.stop(); } catch { /* already stopped */ } }, 700);
      } catch { /* context closed */ }
    },
  };
}

export function stopAllSound() {
  ambience(null);
}

export function haptic(ms = 12) {
  try { navigator.vibrate?.(ms); } catch { /* unsupported */ }
}
