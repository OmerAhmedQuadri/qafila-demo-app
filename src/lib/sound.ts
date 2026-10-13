// All sounds are synthesised with Web Audio: no files, no music.
// The demo follows a "voices & nature only" principle (soft chimes, wind, crickets, birds).
import { useStore } from "../state/store";

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null; // brown noise: sand, whooshes
let white: AudioBuffer | null = null; // white noise: airy desert wind

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
      white = ctx.createBuffer(1, len, ctx.sampleRate);
      const wd = white.getChannelData(0);
      for (let i = 0; i < len; i++) wd[i] = Math.random() * 2 - 1;
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

/* ---------- ambience: a soundscape per story scene (nature only, no music) ----------
 * night:   crickets + a faint breeze      cave:    crickets muffled by the rock
 * wind:    light, gusty desert wind       morning: birdsong + a faint breeze
 * Wind uses white noise through a mid band-pass with random gusts. Low brown noise on a
 * regular slow swell (the first version) is how synthesised ocean waves are made. */
export type Ambience = "night" | "wind" | "cave" | "morning";

let current: { stop: () => void } | null = null;
let currentKind: Ambience | null = null;

export function ambience(kind: Ambience | null) {
  if (kind === currentKind) return;
  current?.stop();
  current = null;
  currentKind = kind;
  if (!kind) return;
  const a = ac();
  if (!a || !white) {
    currentKind = null;
    return;
  }
  const timers: number[] = [];
  const sources: AudioScheduledSourceNode[] = [];
  const later = (fn: () => void, ms: number) => void timers.push(window.setTimeout(fn, ms));
  const panner = (pan: number, dest: AudioNode) => {
    if (!a.createStereoPanner) return dest;
    const p = a.createStereoPanner();
    p.pan.value = pan;
    p.connect(dest);
    return p;
  };

  const master = a.createGain();
  master.gain.setValueAtTime(0, a.currentTime);
  master.gain.linearRampToValueAtTime(1, a.currentTime + 2);
  master.connect(a.destination);

  const wind = (level: number) => {
    const src = a.createBufferSource();
    src.buffer = white;
    src.loop = true;
    const hp = a.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 450;
    const bp = a.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1100;
    bp.Q.value = 0.6;
    const g = a.createGain();
    g.gain.value = level * 0.4;
    src.connect(hp).connect(bp).connect(g).connect(master);
    src.start();
    sources.push(src);
    const gust = () => {
      const t = a.currentTime;
      const strength = 0.2 + Math.random() * 0.8; // irregular, never a steady swell
      g.gain.setTargetAtTime(level * strength, t, 0.5 + Math.random() * 1.2);
      bp.frequency.setTargetAtTime(700 + strength * 1400, t, 0.9); // stronger gust = brighter whistle
      later(gust, 1600 + Math.random() * 3600);
    };
    gust();
  };

  const crickets = (level: number, muffled = false) => {
    const out = a.createGain();
    out.gain.value = level;
    if (muffled) {
      const lp = a.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2600;
      out.connect(lp).connect(master);
    } else out.connect(master);
    const cricket = (pitch: number, pan: number, every: number) => {
      const dest = panner(pan, out);
      const chirp = () => {
        const t0 = a.currentTime + 0.02;
        const pulses = Math.random() < 0.3 ? 4 : 3;
        for (let i = 0; i < pulses; i++) {
          const t = t0 + i * 0.045;
          const o = a.createOscillator();
          const g = a.createGain();
          o.frequency.value = pitch;
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(1, t + 0.006);
          g.gain.linearRampToValueAtTime(0, t + 0.032);
          o.connect(g).connect(dest);
          o.start(t);
          o.stop(t + 0.04);
        }
        later(chirp, every * (0.75 + Math.random() * 0.5) + (Math.random() < 0.12 ? 1800 : 0));
      };
      later(chirp, Math.random() * 900);
    };
    cricket(4400, -0.45, 780);
    cricket(4800, 0.5, 1020);
  };

  const birds = (level: number) => {
    const out = a.createGain();
    out.gain.value = level;
    out.connect(master);
    const song = () => {
      const dest = panner(Math.random() * 1.6 - 0.8, out);
      const t0 = a.currentTime + 0.02;
      const notes = 2 + Math.floor(Math.random() * 4);
      const base = 2300 + Math.random() * 1500;
      let t = t0;
      for (let i = 0; i < notes; i++) {
        const up = Math.random() < 0.5;
        const o = a.createOscillator();
        const g = a.createGain();
        o.frequency.setValueAtTime(up ? base : base * 1.45, t);
        o.frequency.exponentialRampToValueAtTime(up ? base * 1.45 : base * 0.9, t + 0.07);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(1, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.085);
        o.connect(g).connect(dest);
        o.start(t);
        o.stop(t + 0.1);
        t += 0.09 + Math.random() * 0.06;
      }
      later(song, 1100 + Math.random() * 3400);
    };
    later(song, 500);
  };

  switch (kind) {
    case "night":
      crickets(0.035);
      wind(0.01);
      break;
    case "wind":
      wind(0.035);
      break;
    case "cave":
      crickets(0.022, true);
      break;
    case "morning":
      birds(0.03);
      wind(0.008);
      break;
  }

  current = {
    stop: () => {
      timers.forEach((id) => window.clearTimeout(id));
      try {
        master.gain.cancelScheduledValues(a.currentTime);
        master.gain.setValueAtTime(master.gain.value, a.currentTime);
        master.gain.linearRampToValueAtTime(0, a.currentTime + 0.6);
        window.setTimeout(() => {
          sources.forEach((src) => {
            try { src.stop(); } catch { /* already stopped */ }
          });
          master.disconnect();
        }, 700);
      } catch { /* context closed */ }
    },
  };
}

export function stopAllSound() {
  ambience(null);
}

// Turning sound off silences the soundscape straight away, not only new effects.
useStore.subscribe((s, prev) => {
  if (prev.sound && !s.sound) stopAllSound();
});

export function haptic(ms = 12) {
  try { navigator.vibrate?.(ms); } catch { /* unsupported */ }
}
