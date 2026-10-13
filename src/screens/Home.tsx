import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { useStore, streakNow, type Tab } from "../state/store";
import { KidAvatar, Lantern, Tamr } from "../art/Characters";
import { FootprintsToThawr, MiniScene } from "../art/scenes/Scenes";
import { IconBeads, IconCheck, IconHeart, IconHome, IconLock, IconMap, IconPlay, IconSprout, IconBook } from "../art/Icons";
import { Button, ProgressBar, Rich, SampleNote, Sheet } from "../components/ui";
import { hijrahSteps, HIJRAH_TITLE } from "../content/hijrah";
import { sfx } from "../lib/sound";

const NAMES = { ayaan: "Ayaan", zara: "Zara" } as const;

export function TopBar() {
  const s = useStore();
  const streak = streakNow(s);
  return (
    <div className="flex items-center gap-3 px-5 pt-12 pb-3 land:pt-6">
      <KidAvatar kind={s.childId} size={46} />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] text-muted">Assalamu alaikum,</div>
        <div className="truncate font-display text-xl leading-tight">{NAMES[s.childId]}!</div>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-cream py-1 pr-3.5 pl-2 shadow-sm" aria-label={`${streak} day streak`}>
        <Lantern size={18} lit />
        <span className="font-display text-lg leading-none">{streak}</span>
      </div>
      <button aria-label="Grown-ups area" onClick={() => s.go("parentGate")} className="grid h-11 w-11 place-items-center rounded-full bg-cream text-muted shadow-sm">
        <IconLock size={20} />
      </button>
    </div>
  );
}

function WeekLanterns() {
  const s = useStore();
  const todayLit = s.goals.lesson || s.goals.dhikr;
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  return (
    <div className="rounded-3xl bg-night p-4 text-cream pattern-dark">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-display text-lg">Your lanterns this week</div>
        <div className="text-xs text-saffron">{streakNow(s)} days of light</div>
      </div>
      <div className="flex justify-between">
        {days.map((d, i) => {
          const isToday = i === 6;
          const lit = isToday ? todayLit : true;
          const friday = d.getDay() === 5;
          return (
            <div key={i} className="flex w-[13%] flex-col items-center gap-1">
              <motion.div animate={isToday && lit ? { scale: [1, 1.25, 1] } : {}} transition={{ duration: 0.6 }}>
                <Lantern lit={lit} size={isToday ? 26 : 22} pulse={isToday && lit} />
              </motion.div>
              <span className={`whitespace-nowrap ${isToday ? "text-[10px] font-extrabold text-saffron" : "text-[11px] text-white/60"}`}>{isToday ? "Today" : d.toLocaleDateString("en", { weekday: "short" }).slice(0, 2)}</span>
              {friday && <span className="rounded-full bg-terracotta px-1.5 text-[9px] leading-4">New</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Goals() {
  const s = useStore();
  const items: { key: keyof typeof s.goals; label: string; icon: ReactNode; tab?: Tab; color: string }[] = [
    { key: "lesson", label: "Story", icon: <IconBook size={22} />, color: "#D9693B" },
    { key: "dhikr", label: "Dhikr", icon: <IconBeads size={22} />, tab: "dhikr", color: "#1F8A85" },
    { key: "deed", label: "Good deed", icon: <IconHeart size={22} />, color: "#E86A7F" },
  ];
  const n = Object.values(s.goals).filter(Boolean).length;
  return (
    <div className="rounded-3xl bg-cream p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-display text-lg">Today's little plus</div>
        <div className="text-sm text-muted">{n} of 3</div>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {items.map((it) => {
          const done = s.goals[it.key];
          return (
            <button
              key={it.key}
              onClick={() => {
                sfx.tap();
                if (it.key === "lesson") s.openLesson("hijrah");
                else if (it.tab) s.setTab(it.tab);
                else s.showToast(s.liveIt === "committed" ? "Waiting for a grown-up to say yes!" : "Finish today's story to get your good-deed challenge!");
              }}
              className="flex flex-col items-center gap-1.5 rounded-2xl p-3"
              style={{ background: done ? it.color : `${it.color}18`, color: done ? "#FFF8EC" : it.color }}
            >
              <div className="grid h-9 w-9 place-items-center rounded-full" style={{ background: done ? "rgba(255,255,255,.2)" : `${it.color}22` }}>
                {done ? <IconCheck size={20} /> : it.icon}
              </div>
              <span className="font-display text-sm leading-none">{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ContinueCard() {
  const s = useStore();
  const total = hijrahSteps.length - 1;
  const progress = s.lessonDone ? 1 : s.lessonStep / total;
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl bg-night text-cream shadow-lg">
      <div className="relative h-44 @2xl:h-64 land:h-40!">
        <FootprintsToThawr show={10} />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-saffron px-3 py-1 font-display text-xs text-ink">Episode 5 · The Hijrah</div>
        <div className="absolute right-3 bottom-0 animate-bob">
          <Tamr size={78} mood={s.lessonDone ? "cheer" : "wow"} />
        </div>
      </div>
      <div className="space-y-3 p-4 pt-1">
        <div>
          <div className="font-display text-2xl leading-tight">{HIJRAH_TITLE}</div>
          <div className="text-sm text-white/65">Today's lesson: trust in Allah · 6 min</div>
        </div>
        <ProgressBar value={progress} dark />
        <Button variant="saffron" className="flex w-full items-center justify-center gap-2" onClick={() => s.openLesson("hijrah")}>
          <IconPlay size={20} /> {s.lessonDone ? "Play again" : s.lessonStep > 0 ? "Continue" : "Start the journey"}
        </Button>
      </div>
    </motion.div>
  );
}

function SmallCards() {
  const s = useStore();
  return (
    <div className="grid grid-cols-2 gap-3">
      <button onClick={() => s.setTab("dhikr")} className="rounded-3xl bg-teal p-4 text-left text-cream shadow-sm">
        <div className="arabic text-right text-2xl leading-tight">سُبْحَانَ اللَّهِ</div>
        <div className="mt-2 font-display text-lg leading-tight">Daily dhikr</div>
        <div className="text-xs text-white/75">{s.dhikrSets > 0 ? `${s.dhikrSets} set${s.dhikrSets > 1 ? "s" : ""} today` : "33 calm counts"}</div>
      </button>
      <button onClick={() => s.setTab("garden")} className="rounded-3xl bg-palm p-4 text-left text-cream shadow-sm">
        <IconSprout size={30} />
        <div className="mt-2 font-display text-lg leading-tight">My garden</div>
        <div className="text-xs text-white/75">{s.plants.length} plants growing</div>
      </button>
    </div>
  );
}

function TamrTip() {
  return (
    <div className="flex items-end gap-2">
      <Tamr size={58} mood="think" />
      <div className="flex-1 rounded-2xl rounded-bl-sm bg-cream p-3 text-sm shadow-sm">
        <span className="font-display text-teal">Did you know?</span> The Islamic calendar starts from the year of the Hijrah, the journey you're about to take!
      </div>
    </div>
  );
}

/** The Friday special's content, published from the Studio. */
function FridaySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const showToast = useStore((s) => s.showToast);
  const tips = [
    { t: "Take a bath and wear clean clothes", c: "#1F8A85" },
    { t: "Go to Jumu'ah prayer with your family", c: "#D9693B" },
    { t: "Send lots of salawat on the Prophet ﷺ", c: "#E86A7F" },
    { t: "Read Surah Al-Kahf", c: "#3B2E6E" },
  ];
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="space-y-4">
        <div className="relative h-28 overflow-hidden rounded-2xl">
          <MiniScene kind="quba" />
          <div className="absolute left-3 top-3 rounded-full bg-saffron px-3 py-1 font-display text-xs text-ink">Friday special</div>
        </div>
        <div>
          <div className="font-display text-2xl leading-tight">Jumu'ah, the best day of the week!</div>
          <p className="mt-1 text-[15px] text-muted">
            <Rich text="The Prophet ﷺ said: “The best day on which the sun has risen is Friday.” (Sahih Muslim 854)" />
          </p>
        </div>
        <div>
          <div className="mb-2 font-display text-lg">Friday sunnahs you can do</div>
          <ul className="space-y-2">
            {tips.map((x) => (
              <li key={x.t} className="flex items-center gap-3 rounded-2xl bg-sand/80 p-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-cream" style={{ background: x.c }}>
                  <IconCheck size={14} />
                </span>
                <span className="text-[15px]"><Rich text={x.t} /></span>
              </li>
            ))}
          </ul>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            onClose();
            showToast("See you on Friday, insha'Allah!");
          }}
        >
          I'll try them this Friday
        </Button>
        <div className="text-center"><SampleNote /></div>
      </div>
    </Sheet>
  );
}

/** Items published from the Studio show up here straight away. */
function JustArrived() {
  const s = useStore();
  const [friday, setFriday] = useState(false);
  const ep6 = s.studio.ep6 === "Live";
  const fri = s.studio.fri === "Live";
  if (!ep6 && !fri) return null;
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-cream p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-terracotta px-2.5 py-0.5 font-display text-xs text-cream">New</span>
        <div className="font-display text-lg">Just arrived</div>
      </div>
      <div className="grid gap-3 @md:grid-cols-2">
        {ep6 && (
          <button onClick={() => s.openLesson("welcome")} className="chunky flex items-center gap-3 overflow-hidden bg-sand p-2 pr-4 text-left" style={{ ["--shade" as string]: "#E2CFA8" }}>
            <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl"><MiniScene kind="madinah" /></div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-extrabold tracking-wider text-terracotta uppercase">Episode 6</div>
              <div className="font-display leading-tight">Madinah Welcomes</div>
              <div className="text-xs text-muted">{s.welcomeDone ? "Completed, masha'Allah!" : "Play the new episode"}</div>
            </div>
            {s.welcomeDone ? <IconCheck size={20} className="text-teal" /> : <IconPlay size={20} className="text-terracotta" />}
          </button>
        )}
        {fri && (
          <button onClick={() => setFriday(true)} className="chunky flex items-center gap-3 overflow-hidden bg-sand p-2 pr-4 text-left" style={{ ["--shade" as string]: "#E2CFA8" }}>
            <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl"><MiniScene kind="quba" /></div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-extrabold tracking-wider text-teal uppercase">Friday special</div>
              <div className="font-display leading-tight">Jumu'ah, the best day</div>
              <div className="text-xs text-muted">4 Friday sunnahs to try</div>
            </div>
            <IconBook size={20} className="text-teal" />
          </button>
        )}
      </div>
      <FridaySheet open={friday} onClose={() => setFriday(false)} />
    </motion.section>
  );
}

function UpNext() {
  const s = useStore();
  const all = [
    { id: "fri", title: "Friday special: Jumu'ah", when: "This Friday", scene: "quba" as const, show: s.studio.fri !== "Live" },
    { id: "welcome", title: "Madinah Welcomes", when: "Next week", scene: "madinah" as const, show: s.studio.ep6 !== "Live" },
    { id: "masjid", title: "Building the Masjid", when: "In 2 weeks", scene: "quba" as const, show: true },
    { id: "brothers", title: "Brothers & Sisters", when: "In 3 weeks", scene: "caravan" as const, show: true },
  ];
  const upcoming = all.filter((x) => x.show).slice(0, 3);
  return (
    <div className="rounded-3xl bg-cream p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-display text-lg">Coming up on the journey</div>
        <button onClick={() => s.setTab("journey")} className="text-sm font-bold text-teal">See map</button>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {upcoming.map((u) => (
          <div key={u.id} className="overflow-hidden rounded-2xl bg-sand">
            <div className="relative h-16 @2xl:h-24">
              <MiniScene kind={u.scene} />
              <div className="absolute inset-0 grid place-items-center bg-night/35">
                <IconLock size={18} className="text-cream" />
              </div>
            </div>
            <div className="p-2">
              <div className="font-display text-[13px] leading-tight">{u.title}</div>
              <div className="text-[11px] text-muted">{u.when}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Home() {
  return (
    <div className="space-y-4 px-5 pb-6">
      <JustArrived />
      <div className="grid gap-4 @2xl:grid-cols-2">
        <ContinueCard />
        <div className="space-y-4">
          <Goals />
          <WeekLanterns />
        </div>
      </div>
      <div className="grid gap-4 @2xl:grid-cols-2">
        <SmallCards />
        <TamrTip />
      </div>
      <UpNext />
    </div>
  );
}

export function BottomNav() {
  const tab = useStore((s) => s.tab);
  const setTab = useStore((s) => s.setTab);
  const fresh = useStore((s) => s.plants.some((p) => p.fresh));
  const items: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: "home", label: "Today", icon: <IconHome size={24} /> },
    { id: "journey", label: "Journey", icon: <IconMap size={24} /> },
    { id: "dhikr", label: "Dhikr", icon: <IconBeads size={24} /> },
    { id: "garden", label: "Garden", icon: <IconSprout size={24} /> },
  ];
  return (
    <nav
      className="relative flex justify-around border-t border-ink/8 bg-cream px-2 pt-2 pb-5 land:order-first land:w-28 land:shrink-0 land:flex-col land:justify-center land:gap-3 land:border-t-0 land:border-r land:px-3 land:py-6"
      aria-label="Main"
    >
      <div className="absolute top-6 left-1/2 hidden -translate-x-1/2 land:block" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="44" height="44">
          <rect width="64" height="64" rx="18" fill="#141B3D" />
          <path d="M32 9l5.6 13.4L51 20.6 41.4 31.2 48.7 44 34.8 39.6 32 54 29.2 39.6 15.3 44l7.3-12.8L13 20.6l13.4 1.8z" fill="#F5B53F" />
          <circle cx="32" cy="31" r="7" fill="#141B3D" />
          <path d="M34.5 26.5a5.5 5.5 0 1 0 0 9 4.4 4.4 0 1 1 0-9z" fill="#F5B53F" />
        </svg>
      </div>
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => {
            sfx.tap();
            setTab(it.id);
          }}
          aria-current={tab === it.id ? "page" : undefined}
          className={`relative flex w-20 flex-col items-center gap-0.5 rounded-2xl py-1.5 transition land:w-full land:py-3 ${tab === it.id ? "bg-saffron/20 text-terracotta-d" : "text-muted"}`}
        >
          {it.icon}
          <span className="font-display text-[13px]">{it.label}</span>
          {it.id === "garden" && fresh && <span className="absolute right-5 top-1 h-2.5 w-2.5 rounded-full bg-rose ring-2 ring-cream" />}
        </button>
      ))}
    </nav>
  );
}
