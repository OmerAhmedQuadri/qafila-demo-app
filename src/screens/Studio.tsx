import { useState } from "react";
import { motion } from "motion/react";
import { useStore, type StudioCol } from "../state/store";
import { IconArrowRight, IconBack, IconCheck, IconClock, IconStudio } from "../art/Icons";
import { MiniScene } from "../art/scenes/Scenes";
import { Button, Rich, Sheet } from "../components/ui";
import { sfx } from "../lib/sound";

type Check = [string, "done" | "doing" | "todo"];
interface Item {
  id: string;
  type: "Episode" | "Colouring" | "Series" | "Dhikr audio" | "Friday special";
  title: string;
  who: string;
  due: string;
  scene: "makkah" | "cave" | "caravan" | "madinah" | "quba" | "hira";
  checklist: Check[];
  note?: string;
  /** Where it appears in the kids' app once live. */
  kids?: "home" | "journey";
  waiting?: string;
}

const ITEMS: Item[] = [
  { id: "ep7", type: "Episode", title: "Ep 7 · Building the Masjid", who: "Script writer", due: "In 2 weeks", scene: "quba", checklist: [["Script", "doing"], ["Storyboard (no faces)", "todo"], ["Animation", "todo"], ["Voice-over", "todo"], ["Scholar sign-off", "todo"]] },
  { id: "c6", type: "Colouring", title: "Palm groves of Madinah", who: "Illustrator", due: "Wed", scene: "madinah", checklist: [["Line art", "doing"], ["Kid test", "todo"]] },
  { id: "ramadan", type: "Series", title: "Ramadan series: Fasting with the Prophet ﷺ", who: "Planning", due: "February", scene: "makkah", checklist: [["Outline", "doing"], ["Scholar review", "todo"]] },
  {
    id: "ep6", type: "Episode", title: "Ep 6 · Madinah Welcomes", who: "Animation team", due: "Fri, next week", scene: "madinah", kids: "journey",
    checklist: [["Script", "done"], ["Storyboard (no faces)", "done"], ["Animation", "done"], ["Voice-over", "done"], ["Scholar sign-off", "doing"]],
    note: "Scholar: “Script checked against Bukhari 3906, 3911 and 3925. Ready for my approval.”",
  },
  {
    id: "d1", type: "Dhikr audio", title: "After-prayer tasbih (33/33/34)", who: "Qari recording", due: "Next week", scene: "hira",
    checklist: [["Recording", "doing"], ["Tajweed check", "todo"]], waiting: "Waiting for the qari's final recording",
  },
  { id: "fri", type: "Friday special", title: "Friday special: Jumu'ah, the best day", who: "Content team", due: "Fri 6:00 am", scene: "quba", kids: "home", checklist: [["Script", "done"], ["Illustrations", "done"], ["Scholar sign-off", "done"]] },
  { id: "ep5", type: "Episode", title: "Ep 5 · The Night Journey to Safety", who: "Approved by the scholar", due: "Live", scene: "cave", kids: "home", checklist: [["Script", "done"], ["Animation", "done"], ["Voice-over", "done"], ["Scholar sign-off", "done"]] },
];

const COLS: StudioCol[] = ["Draft", "Scholar review", "Approved", "Scheduled", "Live"];
const COL_COLOR: Record<StudioCol, string> = { Draft: "#7A6E8A", "Scholar review": "#D08F1C", Approved: "#1F8A85", Scheduled: "#3B2E6E", Live: "#D9693B" };

export function Studio() {
  const s = useStore();
  const col = (id: string) => s.studio[id] ?? "Draft";
  const [selId, setSelId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false); // separate flag keeps content visible while the sheet slides away
  const sel = ITEMS.find((i) => i.id === selId) ?? null;
  const selCol: StudioCol = sel ? col(sel.id) : "Draft";
  const open = (id: string) => {
    sfx.tap();
    setSelId(id);
    setSheetOpen(true);
  };

  const checklist = (sel?.checklist ?? []).map(([label, st]): Check =>
    label === "Scholar sign-off" && selCol !== "Draft" && selCol !== "Scholar review" ? [label, "done"] : [label, st],
  );
  const liveEpisodes = 4 + ITEMS.filter((i) => i.type === "Episode" && col(i.id) === "Live").length;
  const inReview = ITEMS.filter((i) => col(i.id) === "Scholar review").length;

  const move = (id: string, to: StudioCol, msg: string) => {
    s.studioMove(id, to);
    if (to === "Live") sfx.celebrate();
    else sfx.correct();
    s.showToast(msg);
  };

  return (
    <div className="flex h-full flex-col bg-[#F4F1EC]">
      <div className="flex items-center gap-3 bg-night px-5 pt-12 pb-4 text-cream land:pt-5">
        <button aria-label="Back to the app" onClick={() => s.openTab("home")} className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
          <IconBack size={18} />
        </button>
        <IconStudio size={26} className="text-saffron" />
        <div className="flex-1">
          <div className="font-display text-xl leading-none">Media Plus Studio</div>
          <div className="text-xs text-white/60">Web admin preview · this week's content</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <button onClick={() => open("ep6")} className="mb-3 flex w-full items-center gap-3 rounded-2xl bg-saffron/20 px-4 py-2.5 text-left text-sm text-ink">
          <span className="flex-1">
            <b>Try it:</b> approve and publish Episode 6, then tap “View in the kids' app”. What you publish here appears there straight away.
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-saffron px-3 py-1.5 font-display text-sm">
            Open Ep 6 <IconArrowRight size={14} />
          </span>
        </button>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {[["Live episodes", String(liveEpisodes)], ["In review", String(inReview)], ["Next release", "Friday"]].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-white p-3 shadow-sm">
              <div className="text-[11px] text-muted">{k}</div>
              <div className="font-display text-xl">{v}</div>
            </div>
          ))}
        </div>

        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar @2xl:grid @2xl:grid-cols-5 @2xl:overflow-visible">
          {COLS.map((c) => (
            <div key={c} className="w-52 shrink-0 rounded-2xl bg-white/60 p-2.5 @2xl:w-auto">
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COL_COLOR[c] }} />
                <span className="font-display text-[15px]">{c}</span>
                <span className="ml-auto text-xs text-muted">{ITEMS.filter((i) => col(i.id) === c).length}</span>
              </div>
              <div className="space-y-2">
                {ITEMS.filter((i) => col(i.id) === c).map((it) => (
                  <motion.button
                    layout
                    key={it.id}
                    onClick={() => open(it.id)}
                    className={`w-full overflow-hidden rounded-xl bg-white text-left shadow-sm transition ${sheetOpen && selId === it.id ? "ring-2 ring-saffron" : ""}`}
                  >
                    <div className="h-14"><MiniScene kind={it.scene} /></div>
                    <div className="p-2.5">
                      <div className="text-[10px] font-extrabold tracking-wider uppercase" style={{ color: COL_COLOR[c] }}>{it.type}</div>
                      <div className="text-[13.5px] leading-tight font-bold"><Rich text={it.title} /></div>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted"><IconClock size={12} /> {c === "Live" ? "Live now" : it.due}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        {sel && (
        <motion.div key={sel.id + selCol} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
          <div className="text-[11px] font-extrabold tracking-wider uppercase" style={{ color: COL_COLOR[selCol] }}>{selCol} · {sel.type}</div>
          <div className="font-display text-xl leading-tight"><Rich text={sel.title} /></div>
          <div className="text-sm text-muted">{sel.who}</div>
          <ul className="mt-3 space-y-2">
            {checklist.map(([label, st]) => (
              <li key={label} className="flex items-center gap-2.5 text-[15px]">
                <span className={`grid h-6 w-6 place-items-center rounded-full ${st === "done" ? "bg-teal text-white" : st === "doing" ? "bg-saffron/30 text-saffron-d" : "bg-ink/8 text-muted"}`}>
                  {st === "done" ? <IconCheck size={14} /> : st === "doing" ? <span className="h-2 w-2 rounded-full bg-saffron-d" /> : null}
                </span>
                <span className={st === "todo" ? "text-muted" : ""}>{label}</span>
                {st === "doing" && <span className="ml-auto text-xs text-saffron-d">in progress</span>}
              </li>
            ))}
          </ul>
          {sel.note && selCol === "Scholar review" && (
            <div className="mt-3 rounded-2xl bg-saffron/15 p-3 text-sm"><Rich text={sel.note} /></div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {sel.id === "ep6" && selCol === "Scholar review" && (
              <Button variant="teal" className="text-base" onClick={() => move("ep6", "Approved", "Approved by the scholar")}>
                Approve (scholar sign-off)
              </Button>
            )}
            {sel.id === "ep6" && selCol === "Approved" && (
              <>
                <Button variant="terracotta" className="text-base" onClick={() => move("ep6", "Live", "Published! It's live in the kids' app")}>
                  Publish now
                </Button>
                <Button variant="cream" className="text-base" onClick={() => move("ep6", "Scheduled", "Scheduled for Friday, 6:00 am")}>
                  Schedule for Friday
                </Button>
              </>
            )}
            {selCol === "Scheduled" && (
              <Button variant="terracotta" className="text-base" onClick={() => move(sel.id, "Live", "Published! It's live in the kids' app")}>
                Publish now
              </Button>
            )}
            {selCol === "Live" && sel.kids && (
              <Button variant="saffron" className="text-base" onClick={() => s.openTab(sel.kids!)}>
                View in the kids' app
              </Button>
            )}
          </div>
          {sel.waiting && <p className="mt-3 text-sm text-muted">{sel.waiting}. It moves on once the recording is in.</p>}
          {selCol === "Draft" && <p className="mt-3 text-sm text-muted">Your team is still working on this one.</p>}
        </motion.div>
        )}
        </Sheet>
        <p className="mt-4 text-center text-xs text-muted">Your team uploads, the scholar approves, and episodes publish themselves every Friday. No developer needed.</p>
      </div>
    </div>
  );
}
