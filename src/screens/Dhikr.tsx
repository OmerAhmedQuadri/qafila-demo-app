import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "../state/store";
import { DHIKR } from "../content/data";
import { haptic, sfx } from "../lib/sound";
import { IconHeart, IconSpeaker } from "../art/Icons";
import { PlantArt } from "../art/Plants";
import { Portal, SampleNote } from "../components/ui";

export function Dhikr() {
  const s = useStore();
  const d = DHIKR.find((x) => x.id === s.dhikrPhrase) ?? DHIKR[0];
  const [bloom, setBloom] = useState<null | "first" | "again">(null);
  const R = 118;
  const beads = Array.from({ length: d.target }, (_, i) => {
    const a = (i / d.target) * Math.PI * 2 - Math.PI / 2;
    return { x: 150 + R * Math.cos(a), y: 150 + R * Math.sin(a) };
  });

  const tap = () => {
    haptic(10);
    sfx.bead();
    const firstToday = s.dhikrSets === 0;
    const done = s.countDhikr(d.target);
    if (done) {
      haptic(60);
      sfx.setDone();
      setBloom(firstToday ? "first" : "again");
      setTimeout(() => setBloom(null), 2600);
    }
  };

  return (
    <div className="relative min-h-full px-5 pb-8">
      <div className="pt-1">
        <h1 className="font-display text-3xl @2xl:text-4xl">Dhikr</h1>
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <IconHeart size={16} className="text-rose" /> Just between you and Allah. No points, no scores.
        </p>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {DHIKR.map((x) => (
          <button
            key={x.id}
            onClick={() => {
              sfx.tap();
              s.setDhikrPhrase(x.id);
            }}
            className={`shrink-0 rounded-full px-4 py-2 font-display transition ${x.id === d.id ? "text-cream shadow" : "bg-cream text-ink"}`}
            style={x.id === d.id ? { background: x.color } : undefined}
          >
            {x.translit}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-5 @2xl:grid-cols-2 @2xl:items-center">
        <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-cream p-5 text-center shadow-sm">
          <div className="arabic text-[44px] leading-tight" style={{ color: d.color }}>{d.arabic}</div>
          <div className="mt-1 font-display text-xl">{d.translit}</div>
          <div className="text-muted">{d.meaning}</div>
          <button
            onClick={() => s.showToast("In the full app: recited by a qualified reciter")}
            className="mx-auto mt-3 flex items-center gap-2 rounded-full bg-ink/5 px-4 py-1.5 text-sm text-muted"
          >
            <IconSpeaker size={16} /> Listen to the reciter
          </button>
        </motion.div>

        <div className="relative mx-auto aspect-square w-full max-w-[320px] @2xl:max-w-[360px]">
          <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="150" cy="150" r={R} fill="none" stroke="#E2CFA8" strokeWidth="2" strokeDasharray="2 6" />
            {beads.map((b, i) => {
              const on = i < s.dhikrCount;
              const latest = i === s.dhikrCount - 1;
              return (
                <motion.circle
                  key={`${d.id}-${i}`}
                  cx={b.x}
                  cy={b.y}
                  r={latest ? 10 : 8}
                  fill={on ? d.color : "#EADBBE"}
                  stroke={on ? "#FFF8EC" : "#D9C49A"}
                  strokeWidth="2"
                  initial={false}
                  animate={{ scale: latest ? [1, 1.4, 1] : 1 }}
                  style={{ transformOrigin: `${b.x}px ${b.y}px` }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-[21%]">
            <button
              onClick={tap}
              aria-label={`Count ${d.translit}. ${s.dhikrCount} of ${d.target}`}
              className="chunky grid h-full w-full place-items-center rounded-full text-cream"
              style={{ background: d.color, ["--shade" as string]: "rgba(0,0,0,.3)", borderRadius: "9999px" }}
            >
              <div>
                <div className="font-display text-6xl leading-none">{s.dhikrCount}</div>
                <div className="text-sm text-white/75">of {d.target} · tap</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-cream px-4 py-3 text-sm shadow-sm">
        <span className="text-muted">Today, privately</span>
        <span className="font-display text-lg">{s.dhikrSets} {s.dhikrSets === 1 ? "set" : "sets"} complete</span>
      </div>
      <div className="mt-3 rounded-2xl border-2 border-dashed border-dune-d/40 p-3 text-center text-sm text-muted">
        Morning & evening adhkar, with audio and meanings, in the full app
      </div>
      <div className="mt-3 text-center">
        <SampleNote />
      </div>

      <Portal>
      <AnimatePresence>
        {bloom && (
          <motion.div className="pointer-events-auto absolute inset-0 grid place-items-center bg-cream/85 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="text-center" initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <div className="mx-auto w-fit">
                <PlantArt kind="lily" size={110} />
              </div>
              <div className="mt-2 font-display text-3xl" style={{ color: d.color }}>Masha'Allah!</div>
              <p className="mx-auto max-w-[16rem] text-muted">
                {bloom === "first" ? "A dhikr lily bloomed in your garden." : `${d.target} times, with a calm heart.`}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </Portal>
    </div>
  );
}
