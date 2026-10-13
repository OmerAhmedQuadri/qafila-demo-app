import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { useStore } from "../state/store";
import { ERAS, type Unit } from "../content/data";
import { StarMedallion, Tamr } from "../art/Characters";
import { MiniScene } from "../art/scenes/Scenes";
import { IconCheck, IconLock } from "../art/Icons";
import { Button, Sheet } from "../components/ui";
import { sfx } from "../lib/sound";
import { useOrient } from "../components/orient";

function UnitGlyph({ icon, color = "#2B2140" }: { icon: Unit["icon"]; color?: string }) {
  const g: Record<Unit["icon"], ReactNode> = {
    baby: <><path d="M26 10a14 14 0 1 0 0 28 11 11 0 1 1 0-28z" fill={color} /><path d="m34 12 1.6 3.6 3.9.4-3 2.6.9 3.8-3.4-2-3.4 2 .9-3.8-3-2.6 3.9-.4z" fill={color} /></>,
    sheep: <><circle cx="16" cy="24" r="7" fill={color} /><circle cx="24" cy="21" r="8" fill={color} /><circle cx="31" cy="25" r="7" fill={color} /><circle cx="36" cy="18" r="5" fill={color} /><rect x="17" y="30" width="3" height="8" fill={color} /><rect x="28" y="30" width="3" height="8" fill={color} /></>,
    kaaba: <><path d="M10 18 24 12l14 6v16l-14 6-14-6z" fill={color} /><path d="M10 22l14 6 14-6" stroke="#F5B53F" strokeWidth="3" fill="none" /></>,
    light: <><circle cx="24" cy="24" r="7" fill={color} /><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M11 37l4-4M33 15l4-4" stroke={color} strokeWidth="3" strokeLinecap="round" /></>,
    cave: <><path d="M6 40 18 14l8 8 6-10 10 28z" fill={color} /><path d="M20 40c0-6 3-9 6-9s6 3 6 9z" fill="#F5B53F" /></>,
    palm: <><path d="M24 42c-1-10 0-20 2-26" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" /><path d="M26 16c-6-6-14-5-18 0 7-2 13-1 18 2zM26 16c6-7 14-6 17 0-7-3-12-2-17 2zM26 15c-1-7 1-12 6-14-3 5-4 9-5 14z" fill={color} /></>,
    masjid: <><path d="M12 40V24h24v16z" fill={color} /><path d="M14 24a10 10 0 0 1 20 0z" fill={color} /><rect x="38" y="14" width="4" height="26" fill={color} /><path d="M21 40v-7a3 3 0 0 1 6 0v7z" fill="#F5B53F" /></>,
    hands: <><path d="M8 28c4-6 10-8 16-4 6-4 12-2 16 4l-6 6c-3-3-6-3-10 0-4-3-7-3-10 0z" fill={color} /><circle cx="24" cy="16" r="5" fill={color} /></>,
  };
  return <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">{g[icon]}</svg>;
}

export function Journey() {
  const s = useStore();
  const [picked, setPicked] = useState<Unit | null>(null);

  const stateOf = (u: Unit): Unit["state"] => {
    if (u.id === "hijrah") return s.lessonDone ? "done" : "current";
    // Episode 6 unlocks the moment it is published in the Studio
    if (u.id === "welcome") return s.welcomeDone ? "done" : s.studio.ep6 === "Live" ? "new" : "locked";
    return u.state;
  };

  const { w } = useOrient();
  const amp = w >= 700 ? 150 : 70; // wider zigzag on tablets
  const OFF = [0, -amp, 0, amp];
  const ROW = 160;
  let idx = 0;
  return (
    <div className="pattern-light relative min-h-full bg-sand pb-10">
      <div className="px-5 pt-1 pb-2">
        <h1 className="font-display text-3xl @2xl:text-4xl">The Seerah Journey</h1>
        <p className="text-sm text-muted">Explorers track · ages 8–10 · 5 of 42 stories</p>
      </div>
      {ERAS.map((era) => (
        <section key={era.id} className="relative">
          <div className="mx-5 mt-4 overflow-hidden rounded-3xl bg-night shadow-md">
            <div className="relative h-24 @2xl:h-32">
              {/* 4:3 artwork on the right, fading in from the title, so it is never cropped to a strip */}
              <div className="absolute inset-y-0 right-0 aspect-[4/3] h-full [mask-image:linear-gradient(to_right,transparent,black_45%)]">
                <MiniScene kind={era.id === "makkah" ? "makkah" : era.id === "hijrah" ? "caravan" : "madinah"} />
              </div>
              <div className="absolute inset-y-0 left-4 flex flex-col justify-center text-cream">
                <div className="font-display text-2xl leading-none @2xl:text-3xl">{era.name}</div>
                <div className="text-xs text-white/75">{era.subtitle}</div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto max-w-md">
            <svg className="pointer-events-none absolute top-0 left-1/2 -ml-[224px] overflow-visible" width="448" height={era.units.length * ROW} aria-hidden="true">
              <path
                d={era.units
                  .map((_, k) => {
                    const x = 224 + OFF[(idx + k) % 4];
                    const y = k * ROW + ROW / 2;
                    if (k === 0) return `M${x} ${y}`;
                    const px = 224 + OFF[(idx + k - 1) % 4];
                    const py = (k - 1) * ROW + ROW / 2;
                    return `C${px} ${py + 70} ${x} ${y - 70} ${x} ${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#C98F4E"
                strokeOpacity=".45"
                strokeWidth="6"
                strokeDasharray="2 14"
                strokeLinecap="round"
              />
            </svg>
            {era.units.map((u) => {
              const i = idx++;
              const st = stateOf(u);
              const offset = OFF[i % 4];
              const fill = st === "done" ? "#1F8A85" : st === "current" ? "#F5B53F" : st === "new" ? "#F7A072" : "#C9C3D6";
              const shade = st === "done" ? "#136663" : st === "current" ? "#D08F1C" : st === "new" ? "#D9693B" : "#A39CB3";
              return (
                <div key={u.id} className="relative flex h-40 items-center justify-center" style={{ transform: `translateX(${offset}px)` }}>
                  <button
                    aria-label={`${u.title}${st === "locked" ? ", locked" : st === "done" ? ", completed" : st === "new" ? ", new episode" : ", current lesson"}`}
                    onClick={() => {
                      sfx.tap();
                      setPicked(u);
                    }}
                    className="relative transition active:translate-y-1"
                  >
                    {st === "new" && (
                      <>
                        <span className="absolute inset-[-6px] rounded-full border-4 border-terracotta animate-pulse-ring" />
                        <motion.div className="absolute -top-9 left-1/2 z-10 -translate-x-1/2 rounded-xl bg-terracotta px-3 py-1 font-display text-sm whitespace-nowrap text-cream" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                          New episode!
                        </motion.div>
                      </>
                    )}
                    {st === "current" && (
                      <>
                        <span className="absolute inset-[-6px] rounded-full border-4 border-saffron animate-pulse-ring" />
                        <motion.div className="absolute -top-9 left-1/2 z-10 -translate-x-1/2 rounded-xl bg-night px-3 py-1 font-display text-sm whitespace-nowrap text-cream" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                          Start here!
                        </motion.div>
                      </>
                    )}
                    <StarMedallion size={84} fill={fill} shade={shade}>
                      {st === "locked" ? <IconLock size={28} className="text-white" /> : <UnitGlyph icon={u.icon} color={st === "done" ? "#FFF8EC" : "#2B2140"} />}
                    </StarMedallion>
                    {st === "done" && (
                      <span className="absolute -right-1 bottom-1 grid h-7 w-7 place-items-center rounded-full bg-cream text-teal shadow">
                        <IconCheck size={16} />
                      </span>
                    )}
                  </button>
                  <div className="absolute top-[124px] w-44 text-center">
                    <div className={`font-display text-[15px] leading-tight ${st === "locked" ? "text-muted" : "text-ink"}`}>{u.title}</div>
                  </div>
                  {st === "current" && (
                    <div className="absolute animate-bob" style={{ left: offset > 0 ? "6%" : "62%", top: 34 }}>
                      <Tamr size={70} mood="happy" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <div className="mx-5 mt-6 rounded-3xl border-2 border-dashed border-dune-d/40 p-4 text-center text-sm text-muted">
        34 more stories in the full app · a new episode every Friday
      </div>

      <Sheet open={!!picked} onClose={() => setPicked(null)}>
        {picked && (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-fit">
              <StarMedallion size={76} fill={stateOf(picked) === "locked" ? "#C9C3D6" : stateOf(picked) === "done" ? "#1F8A85" : "#F5B53F"} shade="#00000030">
                <UnitGlyph icon={picked.icon} color={stateOf(picked) === "done" ? "#FFF8EC" : "#2B2140"} />
              </StarMedallion>
            </div>
            <div>
              <div className="font-display text-2xl">{picked.title}</div>
              <div className="text-sm text-muted">Character lesson: {picked.lesson}</div>
            </div>
            {stateOf(picked) === "current" && (
              <Button
                className="w-full"
                onClick={() => {
                  setPicked(null);
                  s.openLesson("hijrah");
                }}
              >
                Start the journey
              </Button>
            )}
            {stateOf(picked) === "new" && (
              <>
                <p className="rounded-2xl bg-terracotta/10 p-3 text-terracotta-d">Just published by your team. It's ready to play!</p>
                <Button
                  variant="terracotta"
                  className="w-full"
                  onClick={() => {
                    setPicked(null);
                    s.openLesson("welcome");
                  }}
                >
                  Play the new episode
                </Button>
              </>
            )}
            {stateOf(picked) === "done" &&
              (picked.id === "hijrah" || picked.id === "welcome" ? (
                <>
                  <p className="rounded-2xl bg-teal/10 p-3 text-teal">Completed, masha'Allah!</p>
                  <Button
                    variant="teal"
                    className="w-full"
                    onClick={() => {
                      setPicked(null);
                      s.openLesson(picked.id as "hijrah" | "welcome");
                    }}
                  >
                    Play again
                  </Button>
                </>
              ) : (
                <p className="rounded-2xl bg-teal/10 p-3 text-teal">Completed, masha'Allah! Replays are available in the full app.</p>
              ))}
            {stateOf(picked) === "locked" && (
              <p className="rounded-2xl bg-ink/5 p-3 text-muted">
                {picked.id === "welcome" ? "Your animation team is finishing this episode. It arrives next week, insha'Allah." : "Unlocks as you travel along the journey."}
              </p>
            )}
          </div>
        )}
      </Sheet>
    </div>
  );
}
