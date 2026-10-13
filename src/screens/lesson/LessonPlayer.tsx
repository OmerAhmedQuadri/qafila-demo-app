import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore, streakNow, type LessonId } from "../../state/store";
import { hijrahSteps, HIJRAH_TITLE, type Step } from "../../content/hijrah";
import { welcomeSteps, WELCOME_TITLE } from "../../content/welcome";
import { StoryStep, AyahCard } from "./StoryStep";
import { ChooseStep, ColourStep, LiveItStep, QuizStep, ReflectStep, SequenceStep, TracksGame } from "./Activities";
import { Button, Confetti, ProgressBar, Rich, Sheet } from "../../components/ui";
import { Lantern, Tamr } from "../../art/Characters";
import { MiniScene } from "../../art/scenes/Scenes";
import { PlantArt } from "../../art/Plants";
import { IconBack, IconReadAloud, IconX } from "../../art/Icons";
import { ambience, sfx } from "../../lib/sound";
import { stopSpeaking } from "../../lib/narrate";

interface LessonDef {
  title: string;
  steps: Step[];
  card: { title: string; scene: "cave" | "madinah" };
  plant: string;
  carry: ReactNode;
}

/** A teaching quote card (hadith or saying), styled like the Qur'an card. */
function QuoteCard({ text, refText }: { text: string; refText: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-saffron/60 bg-gradient-to-b from-[#2A2160] to-night p-5 text-center text-cream shadow-[0_0_40px_rgba(245,181,63,.25)]">
      <div className="absolute inset-0 pattern-dark opacity-60" />
      <div className="relative">
        <div className="mb-1 text-[11px] font-extrabold tracking-[.2em] text-saffron uppercase">From the Sunnah</div>
        <div className="font-display text-xl leading-snug">
          <Rich text={text} />
        </div>
        <div className="mt-2 text-xs text-white/55">
          <Rich text={refText} />
        </div>
      </div>
    </div>
  );
}

const LESSONS: Record<LessonId, LessonDef> = {
  hijrah: {
    title: HIJRAH_TITLE,
    steps: hijrahSteps,
    card: { title: "Cave of Thawr", scene: "cave" },
    plant: "Palm of Trust",
    carry: <AyahCard compact />,
  },
  welcome: {
    title: WELCOME_TITLE,
    steps: welcomeSteps,
    card: { title: "Madinah", scene: "madinah" },
    plant: "Palm of Welcome",
    carry: <QuoteCard text="“Whoever believes in Allah and the Last Day, let him honour his guest.”" refText="The Prophet ﷺ · Sahih al-Bukhari 6018" />,
  },
};

function CompleteStep({ lesson, onComplete }: { lesson: LessonDef; onComplete: () => void }) {
  const s = useStore();
  const [fire, setFire] = useState(0);
  useEffect(() => {
    onComplete();
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
          <MiniScene kind={lesson.card.scene} />
        </div>
      ),
      title: `New card: ${lesson.card.title}`,
      text: "Added to your collection.",
    },
    {
      key: "plant",
      art: <PlantArt kind="palm" size={56} />,
      title: `A ${lesson.plant} grew!`,
      text: "Go and see it in your garden.",
    },
  ];

  return (
    <div className="relative h-full overflow-y-auto px-5 pt-2 pb-6 text-center no-scrollbar">
      <Confetti fire={fire} />
      <div className="mx-auto flex max-w-md flex-col items-center land:grid land:min-h-full land:max-w-none land:grid-cols-2 land:content-center land:items-center land:gap-x-10 land:gap-y-5">
        <div className="flex flex-col items-center land:col-start-1 land:row-start-1">
          <motion.div initial={{ scale: 0.4, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 140, damping: 10 }}>
            <Tamr size={140} mood="cheer" />
          </motion.div>
          <h2 className="font-display text-4xl leading-tight text-saffron @2xl:text-5xl">Masha'Allah!</h2>
          <p className="font-display text-lg text-cream">You finished “{lesson.title}”</p>
        </div>

        <div className="mt-5 w-full space-y-3 land:col-start-2 land:row-start-1 land:mt-0">
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

        <motion.div className="mt-5 w-full land:col-start-2 land:row-start-2 land:mt-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
          <div className="mb-2 text-left text-[11px] font-extrabold tracking-[.2em] text-saffron uppercase">What you'll carry with you</div>
          {lesson.carry}
        </motion.div>

        <div className="mt-6 grid w-full grid-cols-2 gap-3 land:col-start-1 land:row-start-2 land:mt-0 land:self-start">
          <Button variant="ghost" onClick={() => s.openTab("home")}>Back to Today</Button>
          <Button variant="saffron" onClick={() => s.openTab("garden")}>See my garden</Button>
        </div>
      </div>
    </div>
  );
}

export function LessonPlayer() {
  const s = useStore();
  const [confirm, setConfirm] = useState(false);
  const [dir, setDir] = useState(1); // 1 = forward, -1 = back (drives the slide direction)
  const [revisit, setRevisit] = useState(false); // story scenes you come back to open fully revealed
  const isWelcome = s.lessonId === "welcome";
  const lesson = LESSONS[s.lessonId];
  const progress = isWelcome
    ? { step: s.welcomeStep, done: s.welcomeDone, set: s.setWelcomeStep, complete: s.completeWelcome }
    : { step: s.lessonStep, done: s.lessonDone, set: s.setLessonStep, complete: s.completeLesson };
  const last = lesson.steps.length - 1;
  const step = Math.min(progress.step, last);
  const cur = lesson.steps[step];

  // replaying a finished lesson starts from the beginning
  useEffect(() => {
    if (progress.done && progress.step >= last) progress.set(0);
  }, [s.lessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  // A soundscape for each story scene; activities stay quiet so taps and chimes are clear.
  useEffect(() => {
    const byScene = { makkah: "night", footprints: "night", caveInside: "cave", caveEntrance: "cave", madinah: "morning", madinahStreet: "morning" } as const;
    ambience(cur.kind === "story" ? byScene[cur.scene] : cur.kind === "tracks" ? "wind" : null);
  }, [cur, s.sound]); // also restarts the scene's sound when sound is switched back on
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
    setDir(1);
    setRevisit(false);
    progress.set(Math.min(step + 1, last));
  };
  const back = () => {
    if (step === 0) return;
    stopSpeaking();
    sfx.whoosh();
    setDir(-1);
    setRevisit(true);
    progress.set(step - 1);
  };
  const canGoBack = step > 0 && cur.kind !== "complete";

  const quizIdx = lesson.steps.slice(0, step + 1).filter((x) => x.kind === "quiz").length;
  const quizTotal = lesson.steps.filter((x) => x.kind === "quiz").length;
  const key = `${s.lessonId}-${step}`;

  const body = (() => {
    switch (cur.kind) {
      case "story":
        return <StoryStep key={key} scene={cur.scene} title={cur.title} lines={cur.lines} ayah={cur.ayah} revealed={revisit} onNext={next} />;
      case "tracks":
        return <TracksGame onNext={next} />;
      case "quiz":
        return <QuizStep key={key} q={cur.q} options={cur.options} explain={cur.explain} n={quizIdx} total={quizTotal} onNext={next} />;
      case "sequence":
        return <SequenceStep onNext={next} />;
      case "colour":
        return <ColourStep onNext={next} />;
      case "reflect":
        return <ReflectStep onNext={next} />;
      case "liveit":
        return <LiveItStep onNext={next} />;
      case "choose":
        return <ChooseStep key={key} {...cur} onNext={next} />;
      case "complete":
        return <CompleteStep key={key} lesson={lesson} onComplete={progress.complete} />;
    }
  })();

  return (
    <div className="pattern-dark relative flex h-full flex-col bg-night">
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 land:pt-5">
        <button aria-label="Leave lesson" onClick={() => (cur.kind === "complete" ? s.openTab("home") : setConfirm(true))} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-cream">
          <IconX size={20} />
        </button>
        <button
          aria-label="Previous step"
          onClick={back}
          disabled={!canGoBack}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-cream transition disabled:opacity-25"
        >
          <IconBack size={20} />
        </button>
        <div className="flex-1">
          <ProgressBar value={step / last} dark />
        </div>
        {/* Story read-aloud switch (not a mute button: app sound lives in Settings / the guide) */}
        <button
          aria-label="Read the story aloud"
          aria-pressed={s.narration}
          onClick={() => {
            if (s.narration) stopSpeaking();
            s.toggleNarration();
            s.showToast(
              s.narration
                ? "Read-aloud off"
                : s.sound
                  ? "Read-aloud on (placeholder voice; real narration by your voice artists)"
                  : "Read-aloud on, but sound is off. Turn sound on to hear it.",
            );
          }}
          className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 font-display text-sm transition ${s.narration ? "bg-saffron text-ink" : "bg-white/10 text-cream"}`}
        >
          <IconReadAloud size={18} />
          Read aloud
        </button>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={key}
            className="absolute inset-0"
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: 40 * d }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: -40 * d }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
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
