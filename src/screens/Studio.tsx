import { useState } from "react";
import { motion } from "motion/react";
import { useStore } from "../state/store";
import { IconBack, IconCheck, IconClock, IconStudio } from "../art/Icons";
import { MiniScene } from "../art/scenes/Scenes";
import { Rich } from "../components/ui";
import { sfx } from "../lib/sound";

type Col = "Draft" | "Scholar review" | "Approved" | "Scheduled";
interface Item {
  id: string;
  col: Col;
  type: "Episode" | "Colouring" | "Quiz" | "Dhikr audio";
  title: string;
  who: string;
  due: string;
  scene: "makkah" | "cave" | "caravan" | "madinah" | "quba" | "hira";
  checklist: [string, "done" | "doing" | "todo"][];
  note?: string;
}

const ITEMS: Item[] = [
  {
    id: "ep6", col: "Scholar review", type: "Episode", title: "Ep 6 · Madinah Welcomes", who: "Animation team", due: "Fri, next week", scene: "madinah",
    checklist: [["Script", "done"], ["Storyboard (no faces)", "done"], ["Animation", "doing"], ["Voice-over", "todo"], ["Scholar sign-off", "doing"]],
    note: "Scholar: “Please cite Bukhari 3906 for the people waiting every morning.”",
  },
  { id: "c6", col: "Draft", type: "Colouring", title: "Palm groves of Madinah", who: "Illustrator", due: "Wed", scene: "madinah", checklist: [["Line art", "doing"], ["Kid test", "todo"]] },
  { id: "q6", col: "Draft", type: "Quiz", title: "Who welcomed the travellers?", who: "Content writer", due: "Thu", scene: "quba", checklist: [["Questions", "doing"], ["Scholar check", "todo"]] },
  {
    id: "ep5", col: "Approved", type: "Episode", title: "Ep 5 · The Night Journey to Safety", who: "Approved by scholar", due: "Live", scene: "cave",
    checklist: [["Script", "done"], ["Animation", "done"], ["Voice-over", "done"], ["Scholar sign-off", "done"]],
  },
  { id: "d1", col: "Approved", type: "Dhikr audio", title: "After-prayer tasbih (33/33/34)", who: "Qari recording", due: "Ready", scene: "hira", checklist: [["Recording", "done"], ["Tajweed check", "done"]] },
  { id: "ep5r", col: "Scheduled", type: "Episode", title: "Ramadan special: The Night of Power", who: "Auto-publish", due: "Fri 6:00 am", scene: "makkah", checklist: [["All steps", "done"]] },
];

const COLS: Col[] = ["Draft", "Scholar review", "Approved", "Scheduled"];
const COL_COLOR: Record<Col, string> = { Draft: "#7A6E8A", "Scholar review": "#D08F1C", Approved: "#1F8A85", Scheduled: "#3B2E6E" };

export function Studio() {
  const openTab = useStore((s) => s.openTab);
  const [sel, setSel] = useState<Item>(ITEMS[0]);
  return (
    <div className="flex h-full flex-col bg-[#F4F1EC]">
      <div className="flex items-center gap-3 bg-night px-5 pt-12 pb-4 text-cream land:pt-5">
        <button aria-label="Back to the app" onClick={() => openTab("home")} className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
          <IconBack size={18} />
        </button>
        <IconStudio size={26} className="text-saffron" />
        <div className="flex-1">
          <div className="font-display text-xl leading-none">Media Plus Studio</div>
          <div className="text-xs text-white/60">Web admin preview · this week's content</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="mb-4 grid grid-cols-3 gap-2">
          {[["Live episodes", "5"], ["In review", "1"], ["Next release", "Friday"]].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-white p-3 shadow-sm">
              <div className="text-[11px] text-muted">{k}</div>
              <div className="font-display text-xl">{v}</div>
            </div>
          ))}
        </div>

        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar @2xl:grid @2xl:grid-cols-4 @2xl:overflow-visible">
          {COLS.map((c) => (
            <div key={c} className="w-56 shrink-0 rounded-2xl bg-white/60 p-2.5 @2xl:w-auto">
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COL_COLOR[c] }} />
                <span className="font-display text-[15px]">{c}</span>
                <span className="ml-auto text-xs text-muted">{ITEMS.filter((i) => i.col === c).length}</span>
              </div>
              <div className="space-y-2">
                {ITEMS.filter((i) => i.col === c).map((it) => (
                  <button
                    key={it.id}
                    onClick={() => {
                      sfx.tap();
                      setSel(it);
                    }}
                    className={`w-full overflow-hidden rounded-xl bg-white text-left shadow-sm transition ${sel.id === it.id ? "ring-2 ring-saffron" : ""}`}
                  >
                    <div className="h-14"><MiniScene kind={it.scene} /></div>
                    <div className="p-2.5">
                      <div className="text-[10px] font-extrabold tracking-wider uppercase" style={{ color: COL_COLOR[c] }}>{it.type}</div>
                      <div className="text-[13.5px] leading-tight font-bold">{it.title}</div>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted"><IconClock size={12} /> {it.due}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <motion.div key={sel.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-3xl bg-white p-4 shadow-sm">
          <div className="text-[11px] font-extrabold tracking-wider uppercase" style={{ color: COL_COLOR[sel.col] }}>{sel.col} · {sel.type}</div>
          <div className="font-display text-xl leading-tight">{sel.title}</div>
          <div className="text-sm text-muted">{sel.who}</div>
          <ul className="mt-3 space-y-2">
            {sel.checklist.map(([label, st]) => (
              <li key={label} className="flex items-center gap-2.5 text-[15px]">
                <span className={`grid h-6 w-6 place-items-center rounded-full ${st === "done" ? "bg-teal text-white" : st === "doing" ? "bg-saffron/30 text-saffron-d" : "bg-ink/8 text-muted"}`}>
                  {st === "done" ? <IconCheck size={14} /> : st === "doing" ? <span className="h-2 w-2 rounded-full bg-saffron-d" /> : null}
                </span>
                <span className={st === "todo" ? "text-muted" : ""}>{label}</span>
                {st === "doing" && <span className="ml-auto text-xs text-saffron-d">in progress</span>}
              </li>
            ))}
          </ul>
          {sel.note && (
            <div className="mt-3 rounded-2xl bg-saffron/15 p-3 text-sm">
              <Rich text={sel.note} />
            </div>
          )}
        </motion.div>
        <p className="mt-4 text-center text-xs text-muted">Your team uploads, the scholar approves, and episodes publish themselves every Friday. No developer needed.</p>
      </div>
    </div>
  );
}
