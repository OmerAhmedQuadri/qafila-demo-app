import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { useStore, streakNow } from "../state/store";
import { HoldButton, Rich, Button } from "../components/ui";
import { KidAvatar, ParentAvatar } from "../art/Characters";
import { IconBack, IconBook, IconChat, IconCheck, IconClock, IconHeart, IconLock, IconRefresh, IconShield, IconStar } from "../art/Icons";
import { SOURCES } from "../content/data";
import { sfx } from "../lib/sound";

export function ParentGate() {
  const go = useStore((s) => s.go);
  const openTab = useStore((s) => s.openTab);
  const [held, setHeld] = useState(false);
  return (
    <div className="pattern-light relative flex h-full flex-col items-center bg-sand px-6 pt-14 text-center land:pt-6">
      <button aria-label="Back" onClick={() => openTab("home")} className="absolute left-4 top-12 grid h-10 w-10 land:top-5 place-items-center rounded-full bg-cream shadow-sm">
        <IconBack size={20} />
      </button>
      <div className="mt-10 grid h-16 w-16 place-items-center rounded-full bg-night text-saffron land:mt-4">
        <IconLock size={30} />
      </div>
      <h1 className="mt-4 font-display text-3xl">For grown-ups</h1>
      <p className="mt-1 max-w-xs text-muted">Press and hold for two seconds. This keeps little fingers out of settings.</p>
      <div className="mt-10 land:mt-6">
        <HoldButton
          label="Press and hold to open the parent area"
          ms={1800}
          color="#3B2E6E"
          size={160}
          onDone={() => {
            setHeld(true);
            setTimeout(() => go("parent"), 350);
          }}
        >
          <motion.div animate={held ? { scale: [1, 1.2, 1] } : {}}>
            <ParentAvatar size={84} />
          </motion.div>
        </HoldButton>
      </div>
      <p className="mt-auto mb-10 text-xs text-muted land:mb-5">In the full app this also asks for the parent's PIN or fingerprint.</p>
    </div>
  );
}

function Card({ title, icon, children, className = "" }: { title: string; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl bg-cream p-4 shadow-sm ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        {icon && <span className="text-teal">{icon}</span>}
        <h2 className="font-display text-lg">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Chips<T extends string | number>({ value, options, onChange, fmt }: { value: T; options: T[]; onChange: (v: T) => void; fmt: (v: T) => string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={String(o)}
          onClick={() => {
            sfx.tap();
            onChange(o);
          }}
          className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${o === value ? "bg-night text-cream" : "bg-ink/6 text-ink"}`}
        >
          {fmt(o)}
        </button>
      ))}
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => {
        sfx.tap();
        onChange();
      }}
      className={`relative h-8 w-14 shrink-0 rounded-full transition ${on ? "bg-teal" : "bg-ink/15"}`}
    >
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-cream shadow transition-all ${on ? "left-7" : "left-1"}`} />
    </button>
  );
}

export function ParentDashboard() {
  const s = useStore();
  const [kid, setKid] = useState<"ayaan" | "zara">(s.childId);
  const [limit, setLimit] = useState(20);
  const [remind, setRemind] = useState("6 pm");
  const [voicesOnly, setVoicesOnly] = useState(true);
  const isAyaan = kid === "ayaan";
  const name = isAyaan ? "Ayaan" : "Zara";
  const he = isAyaan ? "he" : "she";

  const today = (s.goals.lesson ? 8 : 0) + (s.goals.dhikr ? 3 : 0) + (s.goals.deed ? 2 : 0);
  const bars = isAyaan ? [12, 9, 14, 0, 11, 15, today] : [8, 12, 6, 10, 9, 0, 7];
  const max = Math.max(...bars, 15);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return i === 6 ? "Today" : d.toLocaleDateString("en", { weekday: "short" });
  });

  return (
    <div className="h-full overflow-y-auto bg-sand pb-10 no-scrollbar">
      <div className="bg-night px-5 pt-12 pb-6 text-cream pattern-dark land:pt-6">
        <div className="flex items-center justify-between">
          <button onClick={() => s.openTab("home")} className="flex items-center gap-1.5 rounded-full bg-white/10 py-2 pr-4 pl-3 text-sm">
            <IconBack size={16} /> Back to {name}'s app
          </button>
          <ParentAvatar size={40} />
        </div>
        <h1 className="mt-4 font-display text-3xl">Family dashboard</h1>
        <div className="mt-3 flex gap-2">
          {(["ayaan", "zara"] as const).map((k) => (
            <button
              key={k}
              onClick={() => {
                sfx.tap();
                setKid(k);
              }}
              className={`flex items-center gap-2 rounded-full py-1 pr-4 pl-1 font-display ${kid === k ? "bg-cream text-ink" : "bg-white/10 text-cream"}`}
            >
              <KidAvatar kind={k} size={32} /> {k === "ayaan" ? "Ayaan, 9" : "Zara, 8"}
            </button>
          ))}
        </div>
      </div>

      <div className="-mt-3 space-y-4 px-4">
        <motion.section key={kid} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-gradient-to-br from-saffron to-[#F7C978] p-4 text-ink shadow-md">
          <div className="text-[11px] font-extrabold tracking-[.18em] uppercase opacity-70">This week with {name}</div>
          <p className="mt-1 font-display text-[19px] leading-snug">
            {isAyaan ? (
              <Rich text={`${s.lessonDone ? "Travelled through the Hijrah and learned to trust Allah. " : "Is halfway through the Hijrah story. "}${s.welcomeDone ? "Learned how Madinah welcomed its guests. " : ""}Kept a ${streakNow(s)}-day lantern streak${s.dhikrSets ? " and did dhikr today" : ""}.`} />
            ) : (
              "Learned about honesty with Al-Amin and finished 4 dhikr sets."
            )}
          </p>
        </motion.section>

        <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-4">
          {[
            { k: "Streak", v: isAyaan ? `${streakNow(s)} days` : "3 days", icon: <IconStar size={18} /> },
            { k: "Stories", v: isAyaan ? `${4 + (s.lessonDone ? 1 : 0) + (s.welcomeDone ? 1 : 0)} of 42` : "3 of 42", icon: <IconBook size={18} /> },
            { k: "Dhikr sets", v: isAyaan ? `${6 + s.dhikrSets} this week` : "4 this week", icon: <IconHeart size={18} /> },
            { k: "Avg. per day", v: isAyaan ? "11 min" : "9 min", icon: <IconClock size={18} /> },
          ].map((x) => (
            <div key={x.k} className="rounded-2xl bg-cream p-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-muted">{x.icon} {x.k}</div>
              <div className="mt-1 font-display text-xl leading-tight">{x.v}</div>
            </div>
          ))}
        </div>

        <Card title="Minutes of learning" icon={<IconClock size={20} />}>
          <div className="flex h-32 items-end justify-between gap-2">
            {bars.map((b, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <motion.div
                  className={`w-full rounded-t-lg ${i === 6 ? "bg-saffron" : "bg-teal/70"}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(4, (b / max) * 100)}%` }}
                  transition={{ delay: i * 0.05 }}
                />
                <span className={`text-[10px] ${i === 6 ? "font-extrabold text-ink" : "text-muted"}`}>{days[i]}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">Daily limit: {limit} min. The app gently says goodbye when time is up.</p>
        </Card>

        <Card title="Good deeds to approve" icon={<IconHeart size={20} />}>
          {isAyaan && s.liveIt === "committed" ? (
            <div className="rounded-2xl bg-rose/10 p-3">
              <p className="text-[15px]">
                <Rich text={`Ayaan promised: “Be a helper like Asma (RA)” and help at home without being asked.`} />
              </p>
              <p className="mt-1 text-sm text-muted">Did {he} do it today?</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="cream" className="text-base" onClick={() => s.showToast("We'll remind Ayaan gently tomorrow")}>Not yet</Button>
                <Button
                  variant="teal"
                  className="text-base"
                  onClick={() => {
                    sfx.setDone();
                    s.approveLiveIt();
                    s.showToast("A Rose of Helping grew in Ayaan's garden!");
                  }}
                >
                  Yes, {he} did!
                </Button>
              </div>
            </div>
          ) : isAyaan && s.liveIt === "approved" ? (
            <div className="flex items-center gap-3 rounded-2xl bg-teal/10 p-3 text-teal">
              <IconCheck size={22} /> <span className="font-bold">Approved: helped at home like Asma (RA). A rose grew in the garden.</span>
            </div>
          ) : (
            <p className="text-sm text-muted">{isAyaan ? "Nothing waiting. When Ayaan finishes today's story, the real-life challenge appears here for you to approve." : "Zara's last deed (“Share a snack”) was approved on Tuesday."}</p>
          )}
        </Card>

        <Card title="Talk about it at dinner" icon={<IconChat size={20} />}>
          <p className="font-display text-lg leading-snug">
            <Rich text={isAyaan ? "Ask Ayaan: What did the Prophet ﷺ say to Abu Bakr (RA) in the cave?" : "Ask Zara: Why did people call the Prophet ﷺ “Al-Amin”?"} />
          </p>
          <p className="mt-1 text-sm text-muted">
            <Rich text={isAyaan ? "Answer: “Do not be sad. Allah is with us.” (Qur'an 9:40). Share a time Allah helped your family." : "Answer: because he was always honest and trustworthy."} />
          </p>
        </Card>

        <div className="grid gap-4 @2xl:grid-cols-2">
          <Card title="Settings" icon={<IconShield size={20} />}>
            <div className="space-y-4 text-[15px]">
              <div>
                <div className="mb-2 font-bold">Daily screen time</div>
                <Chips value={limit} options={[15, 20, 30, 45]} onChange={setLimit} fmt={(v) => `${v} min`} />
              </div>
              <div>
                <div className="mb-2 font-bold">Gentle reminder</div>
                <Chips value={remind} options={["4 pm", "6 pm", "8 pm"]} onChange={setRemind} fmt={(v) => v} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold">App sounds</div>
                  <div className="text-xs text-muted">All sound: effects, nature sounds and read-aloud</div>
                </div>
                <Toggle on={s.sound} onChange={s.toggleSound} label="App sounds" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold">Voices & nature sounds only</div>
                  <div className="text-xs text-muted">No music anywhere in the app</div>
                </div>
                <Toggle on={voicesOnly} onChange={() => setVoicesOnly((v) => !v)} label="Voices and nature sounds only" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold">Read stories aloud</div>
                  <div className="text-xs text-muted">For early readers</div>
                </div>
                <Toggle on={s.narration} onChange={s.toggleNarration} label="Read stories aloud" />
              </div>
            </div>
          </Card>

          <Card title="Sources & scholar review" icon={<IconBook size={20} />}>
            <p className="mb-3 text-sm text-muted">Every fact links to its source. Nothing goes live until the scholar approves it.</p>
            <ul className="space-y-2.5">
              {SOURCES.map((src) => (
                <li key={src.id} className="rounded-2xl bg-ink/4 p-3">
                  <div className="text-[14px] leading-snug"><Rich text={src.claim} /></div>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-teal">{src.ref}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${src.status === "approved" ? "bg-teal/15 text-teal" : "bg-saffron/25 text-saffron-d"}`}>
                      {src.status === "approved" ? "Approved" : "Review pending"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {["No ads, ever", "No chat between children", "No tracking", "Parent-controlled"].map((t) => (
            <span key={t} className="flex items-center gap-1 rounded-full bg-cream px-3 py-1.5 text-xs font-bold text-teal shadow-sm">
              <IconCheck size={14} /> {t}
            </span>
          ))}
        </div>

        <button onClick={() => s.reset()} className="mx-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted">
          <IconRefresh size={16} /> Reset this demo
        </button>
      </div>
    </div>
  );
}
