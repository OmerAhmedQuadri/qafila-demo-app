import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore, streakNow } from "../../state/store";
import { hijrahSteps, HIJRAH_TITLE } from "../../content/hijrah";
import { StoryStep, AyahCard } from "./StoryStep";
import { ColourStep, LiveItStep, QuizStep, ReflectStep, SequenceStep, TracksGame } from "./Activities";
import { Button, Confetti, ProgressBar, Sheet } from "../../components/ui";
import { Lantern, Tamr } from "../../art/Characters";
import { MiniScene } from "../../art/scenes/Scenes";
import { PlantArt } from "../../art/Plants";
import { IconMute, IconSpeaker, IconX } from "../../art/Icons";
import { ambience, sfx } from "../../lib/sound";
import { stopSpeaking } from "../../lib/narrate";

function CompleteStep() {
  const s = useStore();
  const [fire, setFire] = useState(0);
  useEffect(() => {
    s.completeLesson();
    sfx.celebrate();
    setFire(1);
    const t = setTimeout(() => setFire(2), 1600);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const rewards = [
    {
      key: "lantern",
      art: <Lantern lit size={40} pulse />,
      title: `${streakNow(s)} days of light!`,
      text: "Your lantern streak keeps growing.",
    },
    {
      key: "card",
      art: (
        <div className="h-16 w-20 overflow-hidden rounded-xl ring-2 ring-saffron">
          <MiniScene kind="cave" />
        </div>
      ),
      title: "New card: Cave of Thawr",
      text: "Added to your collection.",
    },
    {
      key: "plant",
      art: <PlantArt kind="palm" size={56} />,
      title: "A Palm of Trust grew!",
      text: "Go and see it in your garden.",
    },
  ];

  return (
    <div className="relative flex h-full flex-col items-center overflow-y-auto px-5 pt-2 pb-6 text-center no-scrollbar">
      <Confetti fire={fire} />
      <motion.div initial={{ scale: 0.4, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 140, damping: 10 }}>
        <Tamr size={140} mood="cheer" />
      </motion.div>
      <h2 className="font-display text-4xl leading-tight text-saffron">Masha'Allah!</h2>
      <p className="font-display text-lg text-cream">You finished “{HIJRAH_TITLE}”</p>

      <div className="mt-5 w-full max-w-md space-y-3">
        {rewards.map((r, i) => (
          <motion.div
            key={r.key}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.5 }}
            onAnimationStart={() => setTimeout(() => sfx.correct(), 600 + i * 500)}
            className="flex items-center gap-4 rounded-2xl bg-cream p-3 text-left"
          >
            <div className="grid w-20 place-items-center">{r.art}</div>
            <div>
              <div className="font-display text-lg leading-tight text-ink">{r.title}</div>
              <div className="text-sm text-muted">{r.text}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div className="mt-5 w-full max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
        <div className="mb-2 text-left text-[11px] font-extrabold tracking-[.2em] text-saffron uppercase">What you'll carry with you</div>
        <AyahCard compact />
      </motion.div>

      <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-3">
        <Button variant="ghost" onClick={() => s.openTab("home")}>Back to Today</Button>
        <Button variant="saffron" onClick={() => s.openTab("garden")}>See my garden</Button>
      </div>
    </div>
  );
}

export function LessonPlayer() {
  const s = useStore();
  const [confirm, setConfirm] = useState(false);
  const last = hijrahSteps.length - 1;
  const step = Math.min(s.lessonStep, last);
  const cur = hijrahSteps[step];

  // replaying a finished lesson starts from the beginning
  useEffect(() => {
    if (s.lessonDone && s.lessonStep >= last) s.setLessonStep(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    ambience(cur.kind === "complete" ? null : cur.kind === "story" && cur.scene === "madinah" ? "wind" : "night");
  }, [cur]);
  useEffect(
    () => () => {
      ambience(null);
      stopSpeaking();
    },
    [],
  );

  const next = () => {
    stopSpeaking();
    sfx.whoosh();
    s.setLessonStep(Math.min(step + 1, last));
  };

  const quizIdx = hijrahSteps.slice(0, step + 1).filter((x) => x.kind === "quiz").length;
  const quizTotal = hijrahSteps.filter((x) => x.kind === "quiz").length;

  const body = (() => {
    switch (cur.kind) {
      case "story":
        return <StoryStep key={step} scene={cur.scene} title={cur.title} lines={cur.lines} ayah={cur.ayah} onNext={next} />;
      case "tracks":
        return <TracksGame onNext={next} />;
      case "quiz":
        return <QuizStep key={step} q={cur.q} options={cur.options} explain={cur.explain} n={quizIdx} total={quizTotal} onNext={next} />;
      case "sequence":
        return <SequenceStep onNext={next} />;
      case "colour":
        return <ColourStep onNext={next} />;
      case "reflect":
        return <ReflectStep onNext={next} />;
      case "liveit":
        return <LiveItStep onNext={next} />;
      case "complete":
        return <CompleteStep />;
    }
  })();

  return (
    <div className="pattern-dark relative flex h-full flex-col bg-night">
      <div className="flex items-center gap-3 px-4 pt-12 pb-3">
        <button aria-label="Leave lesson" onClick={() => (cur.kind === "complete" ? s.openTab("home") : setConfirm(true))} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-cream">
          <IconX size={20} />
        </button>
        <div className="flex-1">
          <ProgressBar value={step / last} dark />
        </div>
        <button
          aria-label={s.narration ? "Turn off read-aloud" : "Turn on read-aloud"}
          aria-pressed={s.narration}
          onClick={() => {
            if (s.narration) stopSpeaking();
            s.toggleNarration();
            s.showToast(s.narration ? "Read-aloud off" : "Read-aloud on (placeholder voice; real narration by your voice artists)");
          }}
          className={`grid h-10 w-10 place-items-center rounded-full ${s.narration ? "bg-saffron text-ink" : "bg-white/10 text-cream"}`}
        >
          {s.narration ? <IconSpeaker size={20} /> : <IconMute size={20} />}
        </button>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.28 }}
          >
            {body}
          </motion.div>
        </AnimatePresence>
      </div>

      <Sheet open={confirm} onClose={() => setConfirm(false)}>
        <div className="space-y-4 text-center">
          <Tamr size={90} mood="think" />
          <div className="font-display text-2xl">Pause the journey?</div>
          <p className="text-muted">Your place is saved. Come back any time to continue.</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="cream" onClick={() => setConfirm(false)}>Keep going</Button>
            <Button
              variant="terracotta"
              onClick={() => {
                setConfirm(false);
                s.openTab("home");
              }}
            >
              Pause
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
