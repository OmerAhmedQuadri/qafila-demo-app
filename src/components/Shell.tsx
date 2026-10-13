import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore, type Screen, type Tab } from "../state/store";
import { Logo } from "../art/Characters";
import { IconRefresh, IconSpeaker, IconMute, IconX, IconSparkle } from "../art/Icons";
import { stopAllSound } from "../lib/sound";
import { stopSpeaking } from "../lib/narrate";

const SIZES = { phone: { w: 390, h: 844 }, tablet: { w: 820, h: 1180 } } as const;

/** Scales a fixed-size device to fit the available space. */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const device = useStore((s) => s.device);
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { w, h } = SIZES[device];
  const bezel = device === "phone" ? 14 : 22;

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      setScale(Math.min((r.width - 32) / (w + bezel * 2), (r.height - 32) / (h + bezel * 2), 1.1));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h, bezel]);

  return (
    <div ref={wrap} className="relative grid h-full w-full place-items-center overflow-hidden">
      <div
        className="relative shrink-0 bg-[#0B0E22] shadow-[0_40px_120px_rgba(0,0,0,.55),0_0_0_2px_rgba(255,255,255,.08)]"
        style={{
          width: w + bezel * 2,
          height: h + bezel * 2,
          padding: bezel,
          borderRadius: device === "phone" ? 58 : 44,
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        <div className="relative h-full w-full overflow-hidden bg-cream" style={{ borderRadius: device === "phone" ? 44 : 26 }}>
          {children}
          {device === "phone" && <div className="pointer-events-none absolute left-1/2 top-2.5 z-[80] h-7 w-28 -translate-x-1/2 rounded-full bg-[#0B0E22]" />}
        </div>
      </div>
    </div>
  );
}

interface TourStep {
  label: string;
  target: () => void;
  note: string;
}

function useTour(): TourStep[] {
  const go = useStore((s) => s.go);
  const openTab = useStore((s) => s.openTab);
  const t = (tab: Tab) => () => openTab(tab);
  const g = (s: Screen) => () => go(s);
  return [
    { label: "Welcome", target: g("splash"), note: "Working name “Qafila” (caravan). Every child joins a caravan travelling through the Seerah, with Tamr the baby camel." },
    { label: "Who's learning?", target: g("profiles"), note: "One family account, a profile per child. No personal data is collected from children (DPDP Act)." },
    { label: "Today", target: t("home"), note: "A 5-minute daily loop: one story, one dhikr, one good deed. The lantern streak lights up, and a new episode arrives every Friday." },
    { label: "Seerah journey", target: t("journey"), note: "The Seerah as a map. Locked stops are your content roadmap: each one is an episode your animation team produces." },
    { label: "Play: The Hijrah", target: g("lesson"), note: "Story → play → check → reflect → live it. The Prophet ﷺ and the Sahaba are never shown, only places, light, objects and footprints." },
    { label: "Dhikr", target: t("dhikr"), note: "Private and gentle: no points, no leaderboards for worship. Exact Arabic with harakat, transliteration and meaning." },
    { label: "My garden", target: t("garden"), note: "Rewards as growth, not scores. Every plant remembers the lesson, dhikr or good deed that grew it." },
    { label: "Parents", target: g("parentGate"), note: "Parental gate, weekly summary, approving real-life deeds, screen-time limits, and every source with its scholar-review status." },
    { label: "Studio (for your team)", target: g("studio"), note: "How Media Plus publishes: draft → scholar review → approved → scheduled for Friday. No developer needed." },
  ];
}

function TourList({ onPick }: { onPick?: () => void }) {
  const steps = useTour();
  const [active, setActive] = useState(0);
  return (
    <ol className="space-y-2">
      {steps.map((s, i) => (
        <li key={s.label}>
          <button
            onClick={() => {
              stopAllSound();
              stopSpeaking();
              setActive(i);
              s.target();
              onPick?.();
            }}
            className={`w-full rounded-2xl px-4 py-3 text-left transition ${active === i ? "bg-white/12 ring-2 ring-saffron" : "hover:bg-white/6"}`}
          >
            <div className="flex items-center gap-3">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-display text-sm ${active === i ? "bg-saffron text-ink" : "bg-white/10 text-cream"}`}>{i + 1}</span>
              <span className="font-display text-[17px] text-cream">{s.label}</span>
            </div>
            {active === i && (
              <p className="mt-2 pl-10 text-[13.5px] leading-relaxed text-white/70">
                {s.note.split("ﷺ").map((p, k, arr) => (
                  <span key={k}>
                    {p}
                    {k < arr.length - 1 && <span className="saw">ﷺ</span>}
                  </span>
                ))}
              </p>
            )}
          </button>
        </li>
      ))}
    </ol>
  );
}

function Controls({ showDevice = true }: { showDevice?: boolean }) {
  const device = useStore((s) => s.device);
  const setDevice = useStore((s) => s.setDevice);
  const sound = useStore((s) => s.sound);
  const toggleSound = useStore((s) => s.toggleSound);
  const reset = useStore((s) => s.reset);
  return (
    <div className="space-y-3">
      <div className={`${showDevice ? "flex" : "hidden"} rounded-2xl bg-white/8 p-1`}>
        {(["phone", "tablet"] as const).map((d) => (
          <button key={d} onClick={() => setDevice(d)} className={`flex-1 rounded-xl py-2 font-display capitalize ${device === d ? "bg-cream text-ink" : "text-white/70"}`}>
            {d}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={toggleSound} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/8 py-2.5 text-sm text-white/80 hover:bg-white/12">
          {sound ? <IconSpeaker size={18} /> : <IconMute size={18} />} Sound {sound ? "on" : "off"}
        </button>
        <button
          onClick={() => {
            stopAllSound();
            reset();
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/8 py-2.5 text-sm text-white/80 hover:bg-white/12"
        >
          <IconRefresh size={18} /> Reset demo
        </button>
      </div>
    </div>
  );
}

export function PresenterPanel() {
  return (
    <aside className="pattern-dark flex h-full w-[340px] shrink-0 flex-col gap-5 overflow-y-auto border-r border-white/8 bg-night p-6 no-scrollbar">
      <div>
        <Logo size={46} light />
        <p className="mt-4 text-[13px] leading-relaxed text-white/60">
          Interactive concept demo for <span className="text-cream">Media Plus</span>. Sample content, no backend. Tap through the app, or jump to a stop below.
        </p>
      </div>
      <Controls />
      <TourList />
      <p className="mt-auto text-[11px] leading-relaxed text-white/40">“Qafila” is a working name. All religious content is sample text pending scholar review. Sounds: voices & nature only.</p>
    </aside>
  );
}

/** On phones/tablets: a small floating button that opens the same guide. */
export function FloatingGuide() {
  const [open, setOpen] = useState(false);
  const screen = useStore((s) => s.screen);
  useEffect(() => setOpen(false), [screen]);
  return (
    <>
      <button
        aria-label="Open demo guide"
        onClick={() => setOpen(true)}
        className="fixed right-0 top-[38%] z-[90] grid h-12 w-8 place-items-center rounded-l-2xl bg-night/80 text-saffron shadow-lg backdrop-blur"
      >
        <IconSparkle size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[95] bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div
              className="pattern-dark absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[2rem] bg-night p-5 pb-8"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <Logo size={36} light />
                <button aria-label="Close guide" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-cream">
                  <IconX size={20} />
                </button>
              </div>
              <TourList onPick={() => setOpen(false)} />
              <div className="mt-5">
                <Controls showDevice={false} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
