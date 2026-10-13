import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sfx, haptic } from "../lib/sound";
import { useStore } from "../state/store";

/** Renders ﷺ in an Arabic font so it displays correctly everywhere. */
export function Rich({ text }: { text: string }) {
  const parts = text.split("ﷺ");
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <span className="saw text-[1.15em] leading-none">ﷺ</span>}
        </span>
      ))}
    </>
  );
}

/** Text for the placeholder voice: honorifics spoken in full, emoji removed. */
export const forSpeech = (t: string) =>
  t.replace(/ﷺ/g, ", peace be upon him,").replace(/\(RA\)/g, "").replace(/[\u{1F300}-\u{1FAFF}]/gu, "");

type Variant = "saffron" | "teal" | "terracotta" | "night" | "cream" | "ghost";
const variants: Record<Variant, { bg: string; fg: string; shade: string }> = {
  saffron: { bg: "#F5B53F", fg: "#2B2140", shade: "#D08F1C" },
  teal: { bg: "#1F8A85", fg: "#FFF8EC", shade: "#136663" },
  terracotta: { bg: "#D9693B", fg: "#FFF8EC", shade: "#B4502A" },
  night: { bg: "#1F2A5C", fg: "#FFF8EC", shade: "#0E1330" },
  cream: { bg: "#FFF8EC", fg: "#2B2140", shade: "#E2CFA8" },
  ghost: { bg: "rgba(255,255,255,.12)", fg: "#FFF8EC", shade: "rgba(0,0,0,.25)" },
};

export function Button({
  variant = "saffron",
  className = "",
  children,
  onClick,
  silent,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; silent?: boolean }) {
  const v = variants[variant];
  return (
    <button
      {...rest}
      onClick={(e) => {
        if (!silent) sfx.tap();
        haptic(8);
        onClick?.(e);
      }}
      className={`chunky font-display text-lg font-bold tracking-wide px-5 py-3 ${className}`}
      style={{ background: v.bg, color: v.fg, ["--shade" as string]: v.shade, ...rest.style }}
    >
      {children}
    </button>
  );
}

export function ProgressBar({ value, dark = false }: { value: number; dark?: boolean }) {
  return (
    <div className={`h-3.5 w-full overflow-hidden rounded-full ${dark ? "bg-white/15" : "bg-ink/10"}`}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: "linear-gradient(90deg,#F5B53F,#FFD98A)" }}
        animate={{ width: `${Math.max(4, Math.min(100, value * 100))}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      />
    </div>
  );
}

/** Bottom sheet modal inside the app frame. */
export function Sheet({ open, onClose, children, dark = false }: { open: boolean; onClose: () => void; children: ReactNode; dark?: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="absolute inset-0 z-40 bg-black/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            className={`absolute inset-x-0 bottom-0 z-50 rounded-t-[2rem] p-6 pb-8 shadow-2xl ${dark ? "bg-night-2 text-cream" : "bg-cream text-ink"}`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className={`mx-auto mb-4 h-1.5 w-12 rounded-full ${dark ? "bg-white/25" : "bg-ink/15"}`} />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Press-and-hold button (used for parent gate and commitments). */
export function HoldButton({
  onDone,
  label,
  ms = 1400,
  color = "#1F8A85",
  children,
  size = 132,
}: {
  onDone: () => void;
  label: string;
  ms?: number;
  color?: string;
  children?: ReactNode;
  size?: number;
}) {
  const [p, setP] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef(0);
  const done = useRef(false);

  const stop = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    if (!done.current) setP(0);
  };
  const begin = () => {
    done.current = false;
    start.current = performance.now();
    sfx.soft();
    const tick = (t: number) => {
      const v = Math.min(1, (t - start.current) / ms);
      setP(v);
      if (v >= 1) {
        done.current = true;
        haptic(30);
        sfx.correct();
        onDone();
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const C = 2 * Math.PI * 58;
  return (
    <button
      aria-label={label}
      className="relative grid select-none place-items-center rounded-full bg-cream shadow-lg touch-none"
      style={{ width: size, height: size }}
      onPointerDown={begin}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !raf.current) begin();
      }}
      onKeyUp={stop}
    >
      <svg viewBox="0 0 128 128" className="absolute inset-0 -rotate-90" width={size} height={size} aria-hidden="true">
        <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(43,33,64,.1)" strokeWidth="9" />
        <circle cx="64" cy="64" r="58" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} />
      </svg>
      <div className="relative">{children}</div>
    </button>
  );
}

export function Toast() {
  const toast = useStore((s) => s.toast);
  const show = useStore((s) => s.showToast);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => show(null), 2600);
    return () => clearTimeout(t);
  }, [toast, show]);
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="pointer-events-none absolute inset-x-6 top-16 z-[70] mx-auto max-w-sm rounded-2xl bg-night px-4 py-3 text-center font-display text-base text-cream shadow-xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Lightweight canvas confetti in brand colours. */
export function Confetti({ fire }: { fire: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!fire) return;
    const c = ref.current;
    if (!c) return;
    const x = c.getContext("2d");
    if (!x) return;
    c.width = c.clientWidth * devicePixelRatio;
    c.height = c.clientHeight * devicePixelRatio;
    x.scale(devicePixelRatio, devicePixelRatio);
    const W = c.clientWidth, H = c.clientHeight;
    const cols = ["#F5B53F", "#1F8A85", "#D9693B", "#E86A7F", "#7FD1B9", "#FFF8EC"];
    const ps = Array.from({ length: 140 }, () => ({
      x: W / 2, y: H * 0.38,
      vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 13 - 3,
      r: Math.random() * 5 + 3, c: cols[(Math.random() * cols.length) | 0],
      rot: Math.random() * 6, life: 1, star: Math.random() < 0.3,
    }));
    let id = 0;
    const frame = () => {
      x.clearRect(0, 0, W, H);
      let alive = 0;
      for (const p of ps) {
        p.vy += 0.32; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.rot += 0.18; p.life -= 0.008;
        if (p.life <= 0 || p.y > H + 20) continue;
        alive++;
        x.save(); x.globalAlpha = p.life; x.translate(p.x, p.y); x.rotate(p.rot); x.fillStyle = p.c;
        if (p.star) {
          x.beginPath();
          for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4, q = i % 2 ? p.r * 0.45 : p.r; x.lineTo(Math.cos(a) * q, Math.sin(a) * q); }
          x.fill();
        } else x.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        x.restore();
      }
      if (alive) id = requestAnimationFrame(frame);
      else x.clearRect(0, 0, W, H);
    };
    id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, [fire]);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-[60] h-full w-full" />;
}

export function SectionTitle({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <h2 className={`font-display text-xl font-bold ${dark ? "text-cream" : "text-ink"}`}>{children}</h2>;
}

export function SampleNote({ dark = false }: { dark?: boolean }) {
  return (
    <p className={`text-[11px] font-bold tracking-wide ${dark ? "text-white/45" : "text-muted/80"}`}>
      Sample content · scholar review pending
    </p>
  );
}
