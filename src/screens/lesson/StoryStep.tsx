import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "../../state/store";
import type { SceneKind } from "../../content/hijrah";
import { AYAH } from "../../content/hijrah";
import { CaveEntrance, CaveInside, FootprintsToThawr, MadinahDawn, MadinahStreet, MakkahNight } from "../../art/scenes/Scenes";
import { Button, Rich, forSpeech, SampleNote } from "../../components/ui";
import { speak } from "../../lib/narrate";
import { IconSpeaker } from "../../art/Icons";
import { sfx } from "../../lib/sound";

function SceneView({ scene, line, safe }: { scene: SceneKind; line: number; safe: boolean }) {
  switch (scene) {
    case "makkah":
      return <MakkahNight />;
    case "footprints":
      return <FootprintsToThawr show={line >= 2 ? 10 : line >= 1 ? 5 : 0} />;
    case "caveInside":
      return <CaveInside glow={line >= 1} />;
    case "caveEntrance":
      return <CaveEntrance safe={safe} />;
    case "madinah":
      return <MadinahDawn />;
    case "madinahStreet":
      return <MadinahStreet />;
  }
}

export function AyahCard({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 16 }}
      className="relative overflow-hidden rounded-3xl border-2 border-saffron/60 bg-gradient-to-b from-[#2A2160] to-night p-5 text-center text-cream shadow-[0_0_40px_rgba(245,181,63,.25)]"
    >
      <div className="absolute inset-0 pattern-dark opacity-60" />
      <div className="relative">
        <div className="mb-1 text-[11px] font-extrabold tracking-[.2em] text-saffron uppercase">From the Qur'an</div>
        <div className={`arabic text-saffron ${compact ? "text-3xl" : "text-[40px]"} leading-snug`} style={{ textShadow: "0 0 24px rgba(245,181,63,.45)" }}>
          {AYAH.arabic}
        </div>
        <div className="mt-1 font-body text-lg text-cream/90">{AYAH.translit}</div>
        <div className="font-display text-xl">{AYAH.meaning}</div>
        <div className="mt-2 text-xs text-white/55">{AYAH.ref}</div>
      </div>
    </motion.div>
  );
}

export function StoryStep({ scene, title, lines, ayah, onNext }: { scene: SceneKind; title: string; lines: string[]; ayah?: boolean; onNext: () => void }) {
  const narration = useStore((s) => s.narration);
  const [shown, setShown] = useState(1);
  const [showAyah, setShowAyah] = useState(false);
  const [safe, setSafe] = useState(false);
  const allLines = shown >= lines.length;

  useEffect(() => {
    if (narration) speak(forSpeech(lines[shown - 1]));
  }, [shown, narration, lines]);

  const advance = () => {
    if (!allLines) {
      sfx.soft();
      setShown((n) => n + 1);
      return;
    }
    if (ayah && !showAyah) {
      sfx.correct();
      setShowAyah(true);
      if (narration) speak("Do not be sad. Indeed, Allah is with us.");
      return;
    }
    if (ayah && showAyah && !safe) {
      sfx.whoosh();
      setSafe(true);
      if (narration) speak("The searchers turned around and left. Allah kept them safe.");
      return;
    }
    onNext();
  };

  const label = !allLines ? "Next" : ayah && !showAyah ? "What did he say?" : ayah && !safe ? "And then…" : "Continue";

  return (
    <div className="flex h-full flex-col land:flex-row land:items-center land:gap-6 land:px-5 land:pb-5">
      <div className="relative mx-4 aspect-[4/3] shrink-0 overflow-hidden rounded-[1.75rem] shadow-xl land:mx-0 land:w-[56%]">
        <SceneView scene={scene} line={shown - 1} safe={safe} />
        <div className="absolute left-3 top-3 rounded-full bg-night/70 px-3 py-1 font-display text-sm text-cream backdrop-blur">{title}</div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col land:self-stretch">
      <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 no-scrollbar land:px-1 land:pt-0">
      <div className="space-y-2.5 land:my-auto">
        <AnimatePresence initial={false}>
          {lines.slice(0, shown).map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: i === shown - 1 ? 1 : 0.6, y: 0 }}
              className="flex items-start gap-2"
            >
              <p className="flex-1 font-display text-[19px] leading-snug text-cream @2xl:text-[22px]">
                <Rich text={l} />
              </p>
              {i === shown - 1 && (
                <button aria-label="Read this line aloud" onClick={() => speak(forSpeech(l))} className="mt-0.5 rounded-full bg-white/10 p-2 text-saffron">
                  <IconSpeaker size={18} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {showAyah && <AyahCard />}
        {safe && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-[19px] leading-snug text-mint">
            The searchers turned around and left. Allah kept them safe.
          </motion.p>
        )}
        <div className="pt-1 pb-2">
          <SampleNote dark />
        </div>
      </div>
      </div>

      <div className="p-5 pt-3 land:px-1 land:pb-0">
        <Button variant={label === "Continue" ? "saffron" : "cream"} className="w-full" onClick={advance} silent>
          {label}
        </Button>
      </div>
      </div>
    </div>
  );
}
