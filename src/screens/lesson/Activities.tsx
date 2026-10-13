import { useMemo, useRef, useState, type ReactNode, type PointerEvent as RPointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "../../state/store";
import { SEQUENCE } from "../../content/hijrah";
import { MiniScene } from "../../art/scenes/Scenes";
import { Tamr } from "../../art/Characters";
import { Button, HoldButton, Rich } from "../../components/ui";
import { haptic, sfx } from "../../lib/sound";
import { IconCheck, IconHeart, IconSparkle } from "../../art/Icons";
import { useOrient } from "../../components/orient";

/* ---------- shared feedback footer ---------- */
function Feedback({ ok, title, text, onNext, cta = "Continue" }: { ok: boolean; title: string; text?: string; onNext?: () => void; cta?: string }) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      className={`absolute inset-x-0 bottom-0 z-20 rounded-t-[1.75rem] p-5 pb-7 ${ok ? "bg-[#D7F2E7] text-teal-d" : "bg-[#FCE4DA] text-terracotta-d"}`}
    >
      <div className="flex items-start gap-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${ok ? "bg-teal text-cream" : "bg-terracotta text-cream"}`}>
          {ok ? <IconCheck size={22} /> : <IconSparkle size={20} />}
        </div>
        <div className="flex-1">
          <div className="font-display text-xl leading-tight">{title}</div>
          {text && <p className="mt-0.5 text-[15px] leading-snug text-ink/75"><Rich text={text} /></p>}
        </div>
      </div>
      {onNext && (
        <Button variant={ok ? "teal" : "terracotta"} className="mt-4 w-full" onClick={onNext}>
          {cta}
        </Button>
      )}
    </motion.div>
  );
}

function Header({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="px-5">
      <div className="text-[11px] font-extrabold tracking-[.2em] text-saffron uppercase">{kicker}</div>
      <h2 className="font-display text-[26px] leading-tight text-cream @2xl:text-4xl">{title}</h2>
      {children && <p className="mt-1 text-[15px] leading-snug text-white/70 @2xl:text-lg">{children}</p>}
    </div>
  );
}

/* ---------- 1. Hide the tracks (Amir's sheep) ---------- */
function Sheep({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 60 44" width="58" height="42" aria-hidden="true" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      <rect x="14" y="30" width="5" height="12" rx="2.5" fill="#3B2E6E" />
      <rect x="36" y="30" width="5" height="12" rx="2.5" fill="#3B2E6E" />
      <g fill="#FFF8EC">
        <circle cx="16" cy="22" r="10" /><circle cx="27" cy="16" r="11" /><circle cx="38" cy="22" r="10" /><circle cx="27" cy="27" r="10" />
      </g>
      <ellipse cx="49" cy="20" rx="8" ry="9.5" fill="#3B2E6E" />
      <ellipse cx="44" cy="13" rx="5" ry="2.6" fill="#3B2E6E" transform="rotate(-25 44 13)" />
      <circle cx="51.5" cy="18" r="1.8" fill="#FFF8EC" />
      <circle cx="51.9" cy="17.6" r=".8" fill="#2B2140" />
    </svg>
  );
}

const TRACK: [number, number][] = [[14, 84], [24, 74], [34, 68], [45, 60], [55, 54], [64, 46], [72, 38], [80, 30], [87, 23]];

export function TracksGame({ onNext }: { onNext: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<[number, number]>([14, 88]);
  const [gone, setGone] = useState<boolean[]>(() => TRACK.map(() => false));
  const [dragging, setDragging] = useState(false);
  const [flip, setFlip] = useState(false);
  const left = gone.filter((g) => !g).length;
  const done = left === 0;

  const eraseNear = (x: number, y: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setGone((prev) => {
      let changed = false;
      const next = prev.map((g, i) => {
        if (g) return g;
        const dx = ((TRACK[i][0] - x) / 100) * r.width;
        const dy = ((TRACK[i][1] - y) / 100) * r.height;
        if (Math.hypot(dx, dy) < 44) {
          changed = true;
          return true;
        }
        return g;
      });
      if (changed) {
        sfx.sand();
        haptic(8);
        if (next.filter((g) => !g).length === 0) setTimeout(() => sfx.correct(), 200);
        else if (Math.random() < 0.35) sfx.baa();
      }
      return changed ? next : prev;
    });
  };

  const toPct = (e: RPointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    return [Math.max(4, Math.min(96, ((e.clientX - r.left) / r.width) * 100)), Math.max(8, Math.min(96, ((e.clientY - r.top) / r.height) * 100))] as [number, number];
  };

  return (
    <div className="relative flex h-full flex-col">
      <Header kicker="Play" title="Hide the tracks!">
        Amir ibn Fuhayrah (RA), a shepherd, led his sheep over the footprints so no one could follow. Drag the sheep over every footprint.
      </Header>
      <div
        ref={box}
        className="relative mx-4 mt-4 flex-1 touch-none overflow-hidden rounded-[1.75rem] shadow-xl"
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setDragging(true);
          const p = toPct(e);
          setFlip(p[0] < pos[0]);
          setPos(p);
          eraseNear(...p);
        }}
        onPointerMove={(e) => {
          if (!dragging) return;
          const p = toPct(e);
          setFlip(p[0] < pos[0] - 0.5 ? true : p[0] > pos[0] + 0.5 ? false : flip);
          setPos(p);
          eraseNear(...p);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="tsand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7E6E9E" />
              <stop offset="1" stopColor="#5A4C7C" />
            </linearGradient>
          </defs>
          <rect width="300" height="400" fill="url(#tsand)" />
          <path d="M0 60 C80 40 160 70 300 40 V0 H0Z" fill="#2A2554" />
          <path d="M170 40 L230 -10 L300 30 V60 Z" fill="#3B3570" />
          {[[40, 140], [220, 120], [90, 300], [250, 260], [150, 220]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} q10 -10 20 0 q10 -10 20 0`} stroke="#8E80B0" strokeWidth="2" fill="none" opacity=".5" />
          ))}
        </svg>
        {TRACK.map(([x, y], i) => (
          <AnimatePresence key={i}>
            {!gone[i] && (
              <motion.div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
                exit={{ opacity: 0, scale: 1.6, filter: "blur(4px)" }}
                transition={{ duration: 0.5 }}
              >
                <svg viewBox="0 0 30 20" width="34" height="24" aria-hidden="true" style={{ transform: `rotate(${-40}deg)` }}>
                  <ellipse cx="7" cy={i % 2 ? 6 : 13} rx="4" ry="6.5" fill="#3E3466" />
                  <ellipse cx="22" cy={i % 2 ? 13 : 6} rx="4" ry="6.5" fill="#3E3466" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
        <motion.div
          className="pointer-events-none absolute"
          animate={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}
          transition={dragging ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16 }}
          style={{ x: "-50%", y: "-70%" }}
        >
          <div className="relative">
            <div className="absolute -left-7 top-3 opacity-90"><Sheep flip={flip} /></div>
            <div className="absolute left-6 top-5 opacity-90"><Sheep flip={flip} /></div>
            <motion.div animate={dragging ? { y: [0, -4, 0] } : {}} transition={{ repeat: Infinity, duration: 0.35 }}>
              <Sheep flip={flip} />
            </motion.div>
          </div>
        </motion.div>
        {!done && (
          <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-night/70 px-3 py-1 font-display text-sm text-cream">{left} footprints left</div>
        )}
      </div>
      <div className="h-6" />
      {done && <Feedback ok title="The tracks are gone!" text="Clever Amir (RA)! Now no one could follow the trail to the cave." onNext={onNext} />}
    </div>
  );
}

/* ---------- 2. Quiz ---------- */
export function QuizStep({ q, options, explain, n, total, onNext }: { q: string; options: { text: string; correct?: boolean }[]; explain: string; n: number; total: number; onNext: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const correct = picked !== null && options[picked].correct;
  const big = useOrient().w >= 672;
  return (
    <div className="relative flex h-full flex-col @2xl:justify-center @2xl:pb-24 land:grid land:grid-cols-2 land:content-center land:items-center land:gap-4">
      <div>
      <Header kicker={`Quick check · ${n} of ${total}`} title={<Rich text={q} />} />
      <div className="mt-3 flex items-end gap-2 px-5">
        <Tamr size={big ? 120 : 72} mood={correct ? "cheer" : "think"} />
        <div className="mb-4 rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2 text-sm text-white/80 @2xl:text-base">{correct ? "Yes!! You remembered!" : "Hmm, think about the story…"}</div>
      </div>
      </div>
      <div className="mt-2 space-y-3 px-5 land:pl-0">
        {options.map((o, i) => {
          const isWrong = wrong.includes(i);
          const isRight = correct && picked === i;
          return (
            <motion.button
              key={i}
              disabled={isWrong || correct}
              animate={isWrong && picked === i ? { x: [0, -8, 8, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              onClick={() => {
                setPicked(i);
                if (o.correct) {
                  sfx.correct();
                  haptic(30);
                } else {
                  sfx.gentleNo();
                  haptic(15);
                  setWrong((w) => [...w, i]);
                }
              }}
              className={`chunky w-full px-5 py-4 text-left font-display text-[19px] @2xl:py-5 @2xl:text-[22px] ${isRight ? "bg-teal text-cream" : isWrong ? "bg-white/5 text-white/35 line-through" : "bg-cream text-ink"}`}
              style={{ ["--shade" as string]: isRight ? "#136663" : isWrong ? "transparent" : "#E2CFA8" }}
            >
              <Rich text={o.text} />
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {correct && <Feedback ok title="Masha'Allah, that's right!" text={explain} onNext={onNext} />}
        {picked !== null && !correct && <Feedback ok={false} title="Not quite, try again!" text="Every try helps you learn." />}
      </AnimatePresence>
    </div>
  );
}

/* ---------- 3. Sequence the journey ---------- */
export function SequenceStep({ onNext }: { onNext: () => void }) {
  const order = useMemo(() => [2, 0, 3, 1], []);
  const [placed, setPlaced] = useState<string[]>([]);
  const [shake, setShake] = useState<string | null>(null);
  const done = placed.length === SEQUENCE.length;
  return (
    <div className="relative flex h-full flex-col @2xl:justify-center @2xl:pb-28">
      <Header kicker="Play" title="Put the journey in order">Tap the cards from first to last.</Header>
      <div className="mt-4 grid grid-cols-4 gap-2 px-5 @2xl:gap-3 land:mx-auto land:w-full land:max-w-2xl">
        {SEQUENCE.map((_, i) => {
          const id = placed[i];
          const item = SEQUENCE.find((x) => x.id === id);
          return (
            <div key={i} className={`relative aspect-[3/4] overflow-hidden rounded-2xl border-2 ${item ? "border-saffron" : "border-dashed border-white/25"}`}>
              {item ? (
                <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full w-full">
                  <MiniScene kind={item.id} />
                </motion.div>
              ) : (
                <div className="grid h-full place-items-center font-display text-2xl text-white/30">{i + 1}</div>
              )}
              {item && <span className="absolute left-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-saffron font-display text-sm text-ink">{i + 1}</span>}
            </div>
          );
        })}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 px-5 land:grid-cols-4">
        {order.map((oi) => {
          const it = SEQUENCE[oi];
          const used = placed.includes(it.id);
          return (
            <motion.button
              key={it.id}
              disabled={used || done}
              animate={shake === it.id ? { x: [0, -8, 8, -6, 6, 0] } : { opacity: used ? 0.25 : 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => {
                const expected = SEQUENCE[placed.length].id;
                if (it.id === expected) {
                  sfx.correct();
                  haptic(15);
                  setPlaced((p) => [...p, it.id]);
                } else {
                  sfx.gentleNo();
                  setShake(it.id);
                  setTimeout(() => setShake(null), 450);
                }
              }}
              className="chunky overflow-hidden bg-cream text-left"
              style={{ ["--shade" as string]: "#E2CFA8" }}
            >
              <div className="h-20 @2xl:h-28"><MiniScene kind={it.id} /></div>
              <div className="p-2.5 font-display text-[15px] leading-tight text-ink @2xl:p-3 @2xl:text-lg">{it.label}</div>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {done && <Feedback ok title="Perfect order!" text="From Makkah, to the cave, across the desert, to Madinah. The Hijrah!" onNext={onNext} />}
      </AnimatePresence>
    </div>
  );
}

/* ---------- 4. Colouring: arriving at Quba ---------- */
const PALETTE = ["#F5B53F", "#D9693B", "#E86A7F", "#1F8A85", "#7FD1B9", "#3E8E5A", "#9FD3E8", "#3B2E6E", "#E6BC84", "#FFF8EC"];

const REGIONS: { id: string; d: string; magic: string }[] = [
  { id: "sky", d: "M0 0 H300 V150 C240 136 200 150 150 142 C100 134 50 150 0 140Z", magic: "#9FD3E8" },
  { id: "sun", d: "M150 70 m-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0", magic: "#F5B53F" },
  { id: "hillL", d: "M0 140 C50 120 90 128 130 146 L130 170 H0Z", magic: "#E6BC84" },
  { id: "hillR", d: "M170 146 C210 124 260 118 300 134 V170 H170Z", magic: "#E6BC84" },
  { id: "ground", d: "M0 170 H300 V300 H0Z", magic: "#E2B77A" },
  { id: "path", d: "M130 300 L140 230 H160 L170 300Z", magic: "#FFF8EC" },
  { id: "wall", d: "M70 150 H230 V230 H70Z", magic: "#FFF8EC" },
  { id: "roof", d: "M60 140 H240 V156 H60Z", magic: "#D9693B" },
  { id: "door", d: "M136 230 V196 a14 14 0 0 1 28 0 V230Z", magic: "#3B2E6E" },
  { id: "win1", d: "M90 176 h22 v24 h-22z", magic: "#1F8A85" },
  { id: "win2", d: "M188 176 h22 v24 h-22z", magic: "#1F8A85" },
  { id: "trunkL", d: "M30 260 C28 220 32 190 38 160 L46 162 C40 192 38 222 40 260Z", magic: "#D9693B" },
  { id: "leavesL", d: "M42 160 C30 140 10 142 0 154 C16 150 30 152 42 164Z M42 160 C56 140 76 142 84 156 C70 150 56 152 42 164Z M42 158 C40 140 46 128 56 122 C50 134 48 146 44 160Z", magic: "#3E8E5A" },
  { id: "trunkR", d: "M262 260 C260 220 264 190 270 160 L278 162 C272 192 270 222 272 260Z", magic: "#D9693B" },
  { id: "leavesR", d: "M274 160 C262 140 242 142 232 154 C248 150 262 152 274 164Z M274 160 C288 140 300 142 300 150 C296 152 288 152 274 164Z M274 158 C272 140 278 128 288 122 C282 134 280 146 276 160Z", magic: "#3E8E5A" },
  { id: "f1", d: "M76 106 L96 106 L86 124Z", magic: "#E86A7F" },
  { id: "f2", d: "M110 112 L130 112 L120 130Z", magic: "#1F8A85" },
  { id: "f3", d: "M170 112 L190 112 L180 130Z", magic: "#F5B53F" },
  { id: "f4", d: "M204 106 L224 106 L214 124Z", magic: "#E86A7F" },
];

export function ColourStep({ onNext }: { onNext: () => void }) {
  const [color, setColor] = useState(PALETTE[0]);
  const [fills, setFills] = useState<Record<string, string>>({});
  const showToast = useStore((s) => s.showToast);
  const count = Object.keys(fills).length;
  const ready = count >= Math.ceil(REGIONS.length * 0.6);
  return (
    <div className="relative flex h-full flex-col">
      <Header kicker="Create" title="Colour Masjid Quba">The very first masjid, built when they arrived. Pick a colour, then tap a shape.</Header>
      <div className="mt-3 flex min-h-0 flex-1 flex-col land:flex-row land:items-stretch land:gap-5 land:px-5 land:pb-5">
      <div className="mx-4 min-h-0 flex-1 overflow-hidden rounded-[1.75rem] bg-cream shadow-xl land:mx-0">
        <svg viewBox="0 0 300 300" className="h-full w-full" role="img" aria-label="Colouring page of Masjid Quba with palm trees and a sunny sky">
          {REGIONS.map((r) => (
            <path
              key={r.id}
              d={r.d}
              fill={fills[r.id] ?? "#FFFFFF"}
              stroke="#2B2140"
              strokeWidth="2.2"
              strokeLinejoin="round"
              className="cursor-pointer transition-[fill] duration-300"
              onClick={() => {
                sfx.tap();
                haptic(6);
                setFills((f) => ({ ...f, [r.id]: color }));
              }}
            />
          ))}
          <path d="M70 106 Q150 140 230 106" stroke="#2B2140" strokeWidth="1.5" fill="none" />
          {[100, 125, 175, 200].map((x) => (
            <path key={x} d={`M${x} 156 V230`} stroke="#2B2140" strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div className="land:flex land:w-64 land:flex-col land:justify-center land:gap-5">
      <div className="mt-3 flex items-center gap-2 overflow-x-auto px-5 py-1 no-scrollbar land:mt-0 land:grid land:grid-cols-5 land:gap-3 land:overflow-visible land:px-1">
        {PALETTE.map((c) => (
          <button
            key={c}
            aria-label={`Colour ${c}`}
            aria-pressed={c === color}
            onClick={() => {
              sfx.soft();
              setColor(c);
            }}
            className={`h-10 w-10 shrink-0 rounded-full shadow-[0_3px_0_rgba(0,0,0,.25)] transition @2xl:h-12 @2xl:w-12 ${c === color ? "scale-110 ring-4 ring-cream" : ""}`}
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="flex gap-3 p-5 pt-3 land:flex-col land:p-0">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() => setFills(Object.fromEntries(REGIONS.map((r) => [r.id, fills[r.id] ?? r.magic])))}
        >
          <span className="inline-flex items-center gap-1.5"><IconSparkle size={18} /> Magic fill</span>
        </Button>
        <Button
          variant="saffron"
          className="flex-1"
          disabled={!ready}
          onClick={() => {
            sfx.correct();
            showToast("Saved to your art gallery!");
            onNext();
          }}
        >
          {ready ? "Done!" : `${count}/${Math.ceil(REGIONS.length * 0.6)} shapes`}
        </Button>
      </div>
      </div>
      </div>
    </div>
  );
}

/* ---------- 5. Reflect ---------- */
const FearIcon = ({ id }: { id: string }) => {
  const c = "#3B2E6E";
  const g: Record<string, ReactNode> = {
    dark: <><path d="M30 8a16 16 0 1 0 10 28A14 14 0 0 1 30 8z" fill={c} /><circle cx="12" cy="12" r="2" fill="#F5B53F" /><circle cx="40" cy="14" r="1.6" fill="#F5B53F" /></>,
    test: <><rect x="10" y="6" width="26" height="34" rx="4" fill="#FFF8EC" stroke={c} strokeWidth="3" /><path d="M16 16h14M16 23h14M16 30h8" stroke={c} strokeWidth="3" strokeLinecap="round" /><path d="M34 30l8-8 4 4-8 8h-4z" fill="#D9693B" /></>,
    new: <><path d="M6 22 24 10l18 12v20H6z" fill="#E6BC84" stroke={c} strokeWidth="3" strokeLinejoin="round" /><rect x="19" y="28" width="10" height="14" fill={c} /><path d="M24 4v8" stroke={c} strokeWidth="3" /><path d="M24 4h8l-2 3 2 3h-8" fill="#D9693B" /></>,
    storm: <><path d="M14 30a9 9 0 0 1 1-18 12 12 0 0 1 22 2 8 8 0 0 1 1 16z" fill="#9FD3E8" stroke={c} strokeWidth="3" /><path d="M26 30l-5 8h6l-4 8" stroke="#F5B53F" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>,
  };
  return <svg viewBox="0 0 48 48" className="h-12 w-12 @2xl:h-16 @2xl:w-16" aria-hidden="true">{g[id]}</svg>;
};

const FEARS = [
  { id: "dark", label: "In the dark" },
  { id: "test", label: "Before a test" },
  { id: "new", label: "At a new place" },
  { id: "storm", label: "During a storm" },
];

export function ReflectStep({ onNext }: { onNext: () => void }) {
  const [pick, setPick] = useState<string | null>(null);
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar">
      <div className="@2xl:my-auto">
      <Header kicker="Think" title="Sometimes we feel scared too">
        <Rich text="Abu Bakr (RA) felt worried in the cave. When do you feel scared?" />
      </Header>
      <div className="mt-4 grid grid-cols-2 gap-3 px-5 land:grid-cols-4">
        {FEARS.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              sfx.soft();
              setPick(f.id);
            }}
            className={`chunky flex flex-col items-center gap-2 p-4 font-display text-[17px] @2xl:p-6 @2xl:text-xl ${pick === f.id ? "bg-saffron text-ink" : "bg-cream text-ink"}`}
            style={{ ["--shade" as string]: pick === f.id ? "#D08F1C" : "#E2CFA8" }}
          >
            <FearIcon id={f.id} />
            {f.label}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {pick && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-5 mt-5 rounded-3xl bg-white/8 p-4 text-center">
            <p className="font-display text-lg leading-snug text-cream">
              <Rich text="Next time, whisper what the Prophet ﷺ said in the cave:" />
            </p>
            <div className="arabic mt-1 text-[40px] leading-snug text-saffron @2xl:text-[52px]" style={{ textShadow: "0 0 20px rgba(245,181,63,.4)" }}>إِنَّ اللَّهَ مَعَنَا</div>
            <div className="font-body text-cream">Innallāha maʿanā · <span className="text-white/70">Allah is with us</span></div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      </div>
      <div className="p-5 land:mx-auto land:w-full land:max-w-md">
        <Button className="w-full" disabled={!pick} onClick={onNext}>
          I'll remember it
        </Button>
      </div>
    </div>
  );
}

/* ---------- 6. Live it (real-life challenge) ---------- */
export function LiveItStep({ onNext }: { onNext: () => void }) {
  const liveIt = useStore((s) => s.liveIt);
  const commit = useStore((s) => s.commitLiveIt);
  const promised = liveIt !== "none";
  return (
    <div className="relative flex h-full flex-col">
      <Header kicker="Live it!" title={<Rich text="Be a helper like Asma (RA)" />}>
        Asma (RA) helped quietly, even when it was hard. Today, help someone at home <b className="text-cream">without being asked</b>.
      </Header>
      <div className="mt-4 flex flex-wrap gap-2 px-5">
        {["Set the table", "Carry the shopping", "Fill water for Nani", "Help a little sibling"].map((t) => (
          <span key={t} className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-cream">{t}</span>
        ))}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {!promised ? (
          <>
            <HoldButton label="Hold to promise" onDone={commit} color="#E86A7F" size={150}>
              <div className="flex flex-col items-center text-rose">
                <IconHeart size={44} />
                <span className="mt-1 font-display text-sm text-ink">Hold to promise</span>
              </div>
            </HoldButton>
            <p className="text-sm text-white/60">Press and hold the heart</p>
          </>
        ) : (
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-6 rounded-3xl bg-cream p-5 text-center">
            <Tamr size={90} mood="cheer" />
            <div className="font-display text-2xl text-ink">Promise made!</div>
            <p className="text-muted">When you've done it, a grown-up will tick it in their app, and something special will grow in your garden.</p>
          </motion.div>
        )}
      </div>
      <div className="p-5 land:mx-auto land:w-full land:max-w-md">
        <Button className="w-full" disabled={!promised} onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}

/* ---------- 7. Choose (generic "how would you…?" with a teaching quote) ---------- */
const ChoiceIcon = ({ icon }: { icon: "salaam" | "water" | "share" | "seat" }) => {
  const c = "#3B2E6E";
  const g: Record<typeof icon, ReactNode> = {
    salaam: <><path d="M8 10h32a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H22l-9 7v-7H8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" fill="#FFF8EC" stroke={c} strokeWidth="3" strokeLinejoin="round" /><path d="M24 29s-8-4.5-8-9.5a4 4 0 0 1 8-1.6 4 4 0 0 1 8 1.6c0 5-8 9.5-8 9.5z" fill="#E86A7F" /></>,
    water: <><path d="M14 8h20l-3 34H17z" fill="#FFF8EC" stroke={c} strokeWidth="3" strokeLinejoin="round" /><path d="M16 20h16l-2 20H18z" fill="#6EC8FF" /></>,
    share: <><ellipse cx="24" cy="34" rx="18" ry="6" fill="#E6BC84" stroke={c} strokeWidth="3" /><circle cx="18" cy="27" r="6" fill="#D9693B" /><circle cx="29" cy="26" r="6" fill="#F5B53F" /><circle cx="24" cy="20" r="5" fill="#B4502A" /></>,
    seat: <><path d="M14 6h20v18H14z" fill="#1F8A85" stroke={c} strokeWidth="3" strokeLinejoin="round" /><path d="M10 24h28v6H10z" fill="#7FD1B9" stroke={c} strokeWidth="3" strokeLinejoin="round" /><path d="M13 30v12M35 30v12" stroke={c} strokeWidth="3" strokeLinecap="round" /></>,
  };
  return <svg viewBox="0 0 48 48" className="h-12 w-12 @2xl:h-16 @2xl:w-16" aria-hidden="true">{g[icon]}</svg>;
};

export function ChooseStep({
  kicker,
  title,
  prompt,
  options,
  response,
  quote,
  cta,
  onNext,
}: {
  kicker: string;
  title: string;
  prompt: string;
  options: { id: string; label: string; icon: "salaam" | "water" | "share" | "seat" }[];
  response: string;
  quote: { text: string; ref: string };
  cta: string;
  onNext: () => void;
}) {
  const [pick, setPick] = useState<string | null>(null);
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar">
        <div className="@2xl:my-auto">
          <Header kicker={kicker} title={<Rich text={title} />}>
            <Rich text={prompt} />
          </Header>
          <div className="mt-4 grid grid-cols-2 gap-3 px-5 land:grid-cols-4">
            {options.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  sfx.soft();
                  setPick(o.id);
                }}
                className={`chunky flex flex-col items-center gap-2 p-4 text-center font-display text-[16px] leading-tight @2xl:p-6 @2xl:text-xl ${pick === o.id ? "bg-saffron text-ink" : "bg-cream text-ink"}`}
                style={{ ["--shade" as string]: pick === o.id ? "#D08F1C" : "#E2CFA8" }}
              >
                <ChoiceIcon icon={o.icon} />
                {o.label}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {pick && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-5 mt-5 rounded-3xl bg-white/8 p-4 text-center">
                <p className="font-display text-lg leading-snug text-cream @2xl:text-xl">
                  <Rich text={response} />
                </p>
                <p className="mt-2 font-display text-xl leading-snug text-saffron @2xl:text-2xl">
                  <Rich text={quote.text} />
                </p>
                <p className="mt-1 text-xs text-white/60">
                  <Rich text={quote.ref} />
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="p-5 land:mx-auto land:w-full land:max-w-md">
        <Button className="w-full" disabled={!pick} onClick={onNext}>
          {cta}
        </Button>
      </div>
    </div>
  );
}
