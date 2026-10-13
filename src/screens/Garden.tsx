import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore, type Plant } from "../state/store";
import { PlantArt } from "../art/Plants";
import { Tamr } from "../art/Characters";
import { MiniScene } from "../art/scenes/Scenes";
import { CARDS } from "../content/data";
import { IconLock, IconSparkle } from "../art/Icons";
import { Rich } from "../components/ui";
import { sfx } from "../lib/sound";

// slot positions (% of the garden scene): back row smaller for depth
const SLOTS: [number, number, number][] = [
  [14, 60, 0.8], [36, 58, 0.76], [64, 58, 0.76], [86, 60, 0.8],
  [10, 76, 0.95], [30, 73, 0.92], [72, 73, 0.92], [90, 76, 0.95],
  [20, 95, 1.08], [42, 97, 1.1], [62, 96, 1.08], [82, 94, 1.05],
];

function GardenScene() {
  const plants = useStore((s) => s.plants);
  const markSeen = useStore((s) => s.markGardenSeen);
  const [sel, setSel] = useState<Plant | null>(null);
  useEffect(() => {
    const t = setTimeout(markSeen, 4000);
    return () => clearTimeout(t);
  }, [markSeen]);

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl shadow-lg @2xl:aspect-[4/3]">
      <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#BFE3F0" />
            <stop offset="1" stopColor="#FFE8C2" />
          </linearGradient>
          <linearGradient id="gground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B5D98A" />
            <stop offset="1" stopColor="#8CC06A" />
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#gsky)" />
        <circle cx="236" cy="70" r="26" fill="#FFE29A" />
        <path d="M0 150 C60 128 120 150 180 136 C230 126 270 140 300 134 V200 H0Z" fill="#E7C08A" />
        {/* garden wall with arch */}
        <path d="M0 160 H300 V200 H0Z" fill="#D9A86C" />
        <path d="M120 200 V176 a30 30 0 0 1 60 0 V200Z" fill="#BFE3F0" opacity=".9" />
        <path d="M0 158 H300" stroke="#C98F4E" strokeWidth="5" />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 26 + 4} 158 l6 -8 6 8`} fill="#C98F4E" />)}
        <path d="M0 196 C80 186 220 186 300 196 V400 H0Z" fill="url(#gground)" />
        {/* oasis pond */}
        <ellipse cx="150" cy="300" rx="70" ry="20" fill="#7FC8D8" />
        <ellipse cx="150" cy="298" rx="58" ry="13" fill="#A6DCE6" />
        <motion.path d="M118 298 q8 -3 16 0 M150 302 q8 -3 16 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 3, repeat: Infinity }} />
        {/* stepping stones */}
        {[[60, 360], [96, 344], [210, 346], [246, 362]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="14" ry="6" fill="#E6D3AE" />)}
      </svg>

      {plants.map((p) => {
        const [x, y, sc] = SLOTS[p.slot % SLOTS.length];
        return (
          <motion.button
            key={p.id}
            aria-label={`${p.label}: ${p.reason}`}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${x}%`, top: `${y}%`, zIndex: Math.round(y) }}
            initial={p.fresh ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 12, delay: p.fresh ? 0.4 : 0 }}
            onClick={() => {
              sfx.soft();
              setSel(p);
            }}
          >
            <motion.div animate={{ rotate: [0, -2, 0, 2, 0] }} transition={{ duration: 5 + (p.slot % 3), repeat: Infinity }} style={{ transformOrigin: "bottom center" }}>
              <PlantArt kind={p.kind} size={86 * sc} />
            </motion.div>
            {p.fresh && (
              <span className="absolute -top-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-saffron px-2 py-0.5 font-display text-xs whitespace-nowrap text-ink shadow">
                <IconSparkle size={12} /> New
              </span>
            )}
          </motion.button>
        );
      })}

      <div className="absolute bottom-3 right-3 z-[95] animate-bob">
        <Tamr size={64} mood="happy" />
      </div>

      <AnimatePresence>
        {sel && (
          <motion.div
            className="absolute inset-x-4 top-4 z-[100] rounded-2xl bg-cream p-4 shadow-xl"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            onClick={() => setSel(null)}
          >
            <div className="flex items-center gap-3">
              <PlantArt kind={sel.kind} size={44} />
              <div className="flex-1">
                <div className="font-display text-lg leading-tight">{sel.label}</div>
                <div className="text-sm text-muted">
                  <Rich text={`Grew because: ${sel.reason}`} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Collection() {
  const cards = useStore((s) => s.cards);
  const lessonDone = useStore((s) => s.lessonDone);
  return (
    <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-3">
      {CARDS.map((c, i) => {
        const have = cards.includes(c.id);
        return (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`relative overflow-hidden rounded-2xl shadow-sm ${have ? "bg-cream" : "bg-ink/5"}`}
          >
            <div className={`relative h-24 ${have ? "" : "opacity-30 grayscale"}`}>
              <MiniScene kind={c.scene} />
            </div>
            {!have && (
              <div className="absolute inset-x-0 top-0 grid h-24 place-items-center text-muted">
                <IconLock size={26} />
              </div>
            )}
            {have && c.id === "thawr" && lessonDone && (
              <span className="absolute right-2 top-2 rounded-full bg-saffron px-2 py-0.5 font-display text-xs text-ink">New card!</span>
            )}
            <div className="p-3">
              <div className="font-display leading-tight">{c.title}</div>
              <div className="mt-0.5 text-xs leading-snug text-muted">{have ? <Rich text={c.fact} /> : "Collect it on the journey"}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function Garden() {
  const [view, setView] = useState<"garden" | "cards">("garden");
  const plants = useStore((s) => s.plants);
  const cards = useStore((s) => s.cards);
  return (
    <div className="min-h-full bg-sand px-5 pb-8">
      <div className="pt-1">
        <h1 className="font-display text-3xl">My Garden of Good</h1>
        <p className="text-sm text-muted">Every lesson, dhikr and good deed grows something beautiful.</p>
      </div>
      <div className="my-4 flex rounded-2xl bg-cream p-1 shadow-sm">
        {(["garden", "cards"] as const).map((v) => (
          <button
            key={v}
            onClick={() => {
              sfx.tap();
              setView(v);
            }}
            className={`flex-1 rounded-xl py-2 font-display ${view === v ? "bg-palm text-cream" : "text-muted"}`}
          >
            {v === "garden" ? `Garden · ${plants.length}` : `Cards · ${cards.length}/${CARDS.length}`}
          </button>
        ))}
      </div>
      {view === "garden" ? <GardenScene /> : <Collection />}
      {view === "garden" && <p className="mt-3 text-center text-sm text-muted">Tap a plant to remember how it grew.</p>}
    </div>
  );
}
