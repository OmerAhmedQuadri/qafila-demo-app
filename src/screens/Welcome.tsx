import { motion } from "motion/react";
import { useStore } from "../state/store";
import { Tamr, KidAvatar, Logo, ParentAvatar } from "../art/Characters";
import { Button } from "../components/ui";
import { IconLock } from "../art/Icons";
import { sfx } from "../lib/sound";

function Dunes() {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[55%] w-full" aria-hidden="true">
      <path d="M0 120 C80 90 150 130 230 104 C300 82 360 110 400 100 V300 H0Z" fill="#3B2E6E" opacity=".9" />
      <path d="M0 170 C90 140 170 180 260 154 C320 138 370 156 400 150 V300 H0Z" fill="#E2B77A" />
      <path d="M0 220 C100 196 200 230 300 208 C350 198 380 206 400 204 V300 H0Z" fill="#C98F4E" />
      {/* caravan silhouettes on the far dune */}
      <motion.g initial={{ x: -60 }} animate={{ x: 30 }} transition={{ duration: 14, repeat: Infinity, repeatType: "reverse", ease: "linear" }}>
        {[60, 96, 132].map((x, i) => (
          <g key={x} transform={`translate(${x} ${104 - i * 3}) scale(.55)`} fill="#2B2140">
            <path d="M0 20 C0 12 6 10 10 10 C12 2 20 2 22 10 C28 10 30 14 30 20 C30 24 24 26 15 26 C6 26 0 24 0 20Z" />
            <path d="M28 14 C32 10 32 4 34 0 L38 2 C36 8 36 14 32 18Z" />
            <ellipse cx="38" cy="1" rx="5" ry="3.5" />
            <rect x="4" y="24" width="3" height="12" /><rect x="22" y="24" width="3" height="12" />
          </g>
        ))}
      </motion.g>
    </svg>
  );
}

export function Splash() {
  const go = useStore((s) => s.go);
  return (
    <div className="relative flex h-full flex-col items-center overflow-hidden bg-gradient-to-b from-night via-dusk to-[#C9708A] text-cream">
      {Array.from({ length: 34 }, (_, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-cream animate-twinkle"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 45}%`, animationDelay: `${(i % 7) * 0.4}s` }}
        />
      ))}
      <motion.div className="relative z-10 mt-[18%] flex flex-col items-center px-6 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Logo size={64} light />
        <p className="mt-6 max-w-xs font-display text-2xl leading-snug">
          Join the caravan. <br />
          Walk with the Prophet <span className="saw">ﷺ</span>, one story at a time.
        </p>
      </motion.div>
      <Dunes />
      <motion.div className="absolute bottom-[19%] left-1/2 z-10 -translate-x-1/2" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
        <div className="animate-bob">
          <Tamr size={150} mood="cheer" />
        </div>
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 z-20 p-6 pb-8">
        <Button
          variant="saffron"
          className="w-full text-xl"
          onClick={() => {
            sfx.celebrate();
            go("profiles");
          }}
        >
          Bismillah, let's begin
        </Button>
        <p className="mt-3 text-center text-[11px] font-bold text-white/60">Working name · concept demo with sample content</p>
      </div>
    </div>
  );
}

export function Profiles() {
  const go = useStore((s) => s.go);
  const setChild = useStore((s) => s.setChild);
  const openTab = useStore((s) => s.openTab);
  const kids = [
    { id: "ayaan" as const, name: "Ayaan", age: 9 },
    { id: "zara" as const, name: "Zara", age: 8 },
  ];
  return (
    <div className="pattern-light relative flex h-full flex-col bg-sand px-6 pt-16 pb-8">
      <div className="flex items-center gap-3">
        <Tamr size={64} mood="happy" />
        <div className="rounded-2xl rounded-bl-sm bg-cream px-4 py-2 font-display text-lg shadow-sm">Assalamu alaikum! Who's travelling today?</div>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-5">
        {kids.map((k, i) => (
          <motion.button
            key={k.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            onClick={() => {
              sfx.correct();
              setChild(k.id);
              openTab("home");
            }}
            className="chunky flex flex-col items-center gap-3 bg-cream p-5"
            style={{ ["--shade" as string]: "#E2CFA8" }}
          >
            <KidAvatar kind={k.id} size={96} />
            <div className="font-display text-2xl leading-none">{k.name}</div>
            <div className="text-sm text-muted">Age {k.age} · Explorer</div>
          </motion.button>
        ))}
      </div>
      <button
        onClick={() => go("parentGate")}
        className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-dashed border-dune-d/40 p-4 text-left"
      >
        <ParentAvatar size={48} />
        <div className="flex-1">
          <div className="font-display text-lg leading-none">Grown-ups</div>
          <div className="mt-1 text-sm text-muted">Progress, settings & sources</div>
        </div>
        <IconLock size={22} className="text-muted" />
      </button>
      <p className="mt-auto text-center text-xs text-muted">Family account · no personal data collected from children</p>
    </div>
  );
}
