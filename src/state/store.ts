import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Screen =
  | "splash"
  | "profiles"
  | "app"
  | "lesson"
  | "parentGate"
  | "parent"
  | "studio";

export type Tab = "home" | "journey" | "dhikr" | "garden";

export type PlantKind = "palm" | "flower" | "olive" | "rose" | "lily";

export interface Plant {
  id: string;
  kind: PlantKind;
  label: string;
  reason: string;
  slot: number; // position index in the garden
  fresh?: boolean;
}

export type LiveItState = "none" | "committed" | "approved";

export type LessonId = "hijrah" | "welcome";

/** Content pipeline columns in the Studio (Media Plus's admin). */
export type StudioCol = "Draft" | "Scholar review" | "Approved" | "Scheduled" | "Live";

const initialStudio: Record<string, StudioCol> = {
  ep7: "Draft",
  c6: "Draft",
  ramadan: "Draft",
  ep6: "Scholar review",
  d1: "Scholar review",
  fri: "Scheduled",
  ep5: "Live",
};

interface Goals {
  lesson: boolean;
  dhikr: boolean;
  deed: boolean;
}

interface State {
  screen: Screen;
  tab: Tab;
  childId: "ayaan" | "zara";
  streakBefore: number; // days lit before today
  lessonId: LessonId;
  lessonStep: number;
  lessonDone: boolean;
  welcomeStep: number;
  welcomeDone: boolean;
  studio: Record<string, StudioCol>;
  dhikrPhrase: string;
  dhikrCount: number;
  dhikrSets: number;
  plants: Plant[];
  cards: string[];
  liveIt: LiveItState;
  goals: Goals;
  sound: boolean;
  narration: boolean;
  device: "phone" | "tablet";
  tabletPortrait: boolean;
  toast: string | null;

  go: (screen: Screen) => void;
  setTab: (tab: Tab) => void;
  openTab: (tab: Tab) => void;
  setChild: (id: "ayaan" | "zara") => void;
  setLessonStep: (n: number) => void;
  completeLesson: () => void;
  openLesson: (id: LessonId) => void;
  setWelcomeStep: (n: number) => void;
  completeWelcome: () => void;
  studioMove: (id: string, col: StudioCol) => void;
  setDhikrPhrase: (id: string) => void;
  countDhikr: (target: number) => boolean; // returns true when a set completes
  commitLiveIt: () => void;
  approveLiveIt: () => void;
  markGardenSeen: () => void;
  toggleSound: () => void;
  toggleNarration: () => void;
  setDevice: (d: "phone" | "tablet") => void;
  toggleTabletPortrait: () => void;
  showToast: (msg: string | null) => void;
  reset: () => void;
}

const initialPlants: Plant[] = [
  { id: "p1", kind: "palm", label: "Palm of Wonder", reason: "Finished “A Blessed Baby”", slot: 0 },
  { id: "p2", kind: "flower", label: "Dhikr Flower", reason: "33 × SubhanAllah on Monday", slot: 3 },
  { id: "p3", kind: "olive", label: "Olive of Honesty", reason: "Finished “Al-Amin, the Trustworthy”", slot: 1 },
  { id: "p4", kind: "rose", label: "Rose of Kindness", reason: "Helped Nani set the table (Mama said yes!)", slot: 5 },
  { id: "p5", kind: "palm", label: "Palm of Light", reason: "Finished “Read! The Cave of Hira”", slot: 2 },
  { id: "p6", kind: "flower", label: "Dhikr Flower", reason: "33 × Alhamdulillah on Wednesday", slot: 6 },
];

const initial = {
  screen: "splash" as Screen,
  tab: "home" as Tab,
  childId: "ayaan" as const,
  streakBefore: 6,
  lessonId: "hijrah" as LessonId,
  lessonStep: 0,
  lessonDone: false,
  welcomeStep: 0,
  welcomeDone: false,
  studio: initialStudio,
  dhikrPhrase: "subhanallah",
  dhikrCount: 0,
  dhikrSets: 0,
  plants: initialPlants,
  cards: ["makkah", "hira"],
  liveIt: "none" as LiveItState,
  goals: { lesson: false, dhikr: false, deed: false },
  sound: true,
  narration: false,
  device: "phone" as const,
  tabletPortrait: false,
  toast: null as string | null,
};

const nextSlot = (plants: Plant[]) => {
  const used = new Set(plants.map((p) => p.slot));
  for (let i = 0; i < 12; i++) if (!used.has(i)) return i;
  return plants.length;
};

// localStorage can be unavailable (private mode, blocked storage); fall back to memory.
const safeStorage = createJSONStorage(() => {
  try {
    const k = "__qafila_test__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return window.localStorage;
  } catch {
    const mem = new Map<string, string>();
    return {
      getItem: (n: string) => mem.get(n) ?? null,
      setItem: (n: string, v: string) => void mem.set(n, v),
      removeItem: (n: string) => void mem.delete(n),
    };
  }
});

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial,

      go: (screen) => set({ screen }),
      setTab: (tab) => set({ tab }),
      openTab: (tab) => set({ screen: "app", tab }),
      setChild: (childId) => set({ childId }),
      setLessonStep: (lessonStep) => set({ lessonStep }),
      openLesson: (lessonId) => set({ lessonId, screen: "lesson" }),
      setWelcomeStep: (welcomeStep) => set({ welcomeStep }),
      studioMove: (id, col) => set({ studio: { ...get().studio, [id]: col } }),

      completeWelcome: () => {
        const s = get();
        if (s.welcomeDone) return;
        set({
          welcomeDone: true,
          goals: { ...s.goals, lesson: true },
          cards: s.cards.includes("madinah") ? s.cards : [...s.cards, "madinah"],
          plants: [
            ...s.plants,
            {
              id: "welcome-palm",
              kind: "palm",
              label: "Palm of Welcome",
              reason: "Finished “Madinah Welcomes”",
              slot: nextSlot(s.plants),
              fresh: true,
            },
          ],
        });
      },

      completeLesson: () => {
        const s = get();
        if (s.lessonDone) return;
        set({
          lessonDone: true,
          goals: { ...s.goals, lesson: true },
          cards: s.cards.includes("thawr") ? s.cards : [...s.cards, "thawr"],
          plants: [
            ...s.plants,
            {
              id: "hijrah-palm",
              kind: "palm",
              label: "Palm of Trust",
              reason: "Finished “The Night Journey to Safety”",
              slot: nextSlot(s.plants),
              fresh: true,
            },
          ],
        });
      },

      setDhikrPhrase: (dhikrPhrase) => set({ dhikrPhrase, dhikrCount: 0 }),

      countDhikr: (target) => {
        const s = get();
        const n = s.dhikrCount + 1;
        if (n >= target) {
          const firstToday = s.dhikrSets === 0;
          set({
            dhikrCount: 0,
            dhikrSets: s.dhikrSets + 1,
            goals: { ...s.goals, dhikr: true },
            plants: firstToday
              ? [
                  ...s.plants,
                  {
                    id: `dhikr-${Date.now()}`,
                    kind: "lily",
                    label: "Dhikr Lily",
                    reason: "Your dhikr today",
                    slot: nextSlot(s.plants),
                    fresh: true,
                  },
                ]
              : s.plants,
          });
          return true;
        }
        set({ dhikrCount: n });
        return false;
      },

      commitLiveIt: () => set({ liveIt: "committed" }),

      approveLiveIt: () => {
        const s = get();
        if (s.liveIt === "approved") return;
        set({
          liveIt: "approved",
          goals: { ...s.goals, deed: true },
          plants: [
            ...s.plants,
            {
              id: "helper-rose",
              kind: "rose",
              label: "Rose of Helping",
              reason: "Helped at home like Asma (RA), Mama said yes!",
              slot: nextSlot(s.plants),
              fresh: true,
            },
          ],
        });
      },

      markGardenSeen: () => set({ plants: get().plants.map((p) => ({ ...p, fresh: false })) }),
      toggleSound: () => set({ sound: !get().sound }),
      toggleNarration: () => set({ narration: !get().narration }),
      setDevice: (device) => set({ device }),
      toggleTabletPortrait: () => set({ tabletPortrait: !get().tabletPortrait }),
      showToast: (toast) => set({ toast }),
      reset: () => set({ ...initial, device: get().device, tabletPortrait: get().tabletPortrait, screen: "splash" }),
    }),
    {
      name: "qafila-demo-v1",
      storage: safeStorage,
      partialize: (s) => {
        const { toast: _t, ...rest } = s;
        void _t;
        return rest;
      },
    },
  ),
);

export const streakNow = (s: { streakBefore: number; goals: Goals }) =>
  s.streakBefore + (s.goals.lesson || s.goals.dhikr ? 1 : 0);
