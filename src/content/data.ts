// Journey units, dhikr phrases, collectible cards and source references (sample content).

export type UnitState = "done" | "current" | "locked";

export interface Unit {
  id: string;
  title: string;
  lesson: string;
  icon: "baby" | "sheep" | "kaaba" | "light" | "cave" | "palm" | "masjid" | "hands";
  state: UnitState;
}

export interface Era {
  id: string;
  name: string;
  subtitle: string;
  units: Unit[];
}

export const ERAS: Era[] = [
  {
    id: "makkah",
    name: "Makkah",
    subtitle: "Where the story begins",
    units: [
      { id: "birth", title: "A Blessed Baby", lesson: "Gratitude", icon: "baby", state: "done" },
      { id: "desert", title: "Desert Days with Halimah", lesson: "Kindness to animals", icon: "sheep", state: "done" },
      { id: "amin", title: "Al-Amin, the Trustworthy", lesson: "Honesty", icon: "kaaba", state: "done" },
      { id: "hira", title: "Read! The Cave of Hira", lesson: "Love of learning", icon: "light", state: "done" },
    ],
  },
  {
    id: "hijrah",
    name: "The Hijrah",
    subtitle: "The great journey",
    units: [{ id: "hijrah", title: "The Night Journey to Safety", lesson: "Trust in Allah", icon: "cave", state: "current" }],
  },
  {
    id: "madinah",
    name: "Madinah",
    subtitle: "A city of light",
    units: [
      { id: "welcome", title: "Madinah Welcomes", lesson: "Hospitality", icon: "palm", state: "locked" },
      { id: "masjid", title: "Building the Masjid", lesson: "Teamwork", icon: "masjid", state: "locked" },
      { id: "brothers", title: "Brothers & Sisters", lesson: "Sharing", icon: "hands", state: "locked" },
    ],
  },
];

export interface Dhikr {
  id: string;
  arabic: string;
  translit: string;
  meaning: string;
  target: number;
  color: string;
}

// After-prayer tasbih (33/33/34) as taught in Sahih Muslim 597. Wording to be confirmed by the scholar.
export const DHIKR: Dhikr[] = [
  { id: "subhanallah", arabic: "سُبْحَانَ اللَّهِ", translit: "SubḥānAllāh", meaning: "Glory be to Allah", target: 33, color: "#1F8A85" },
  { id: "alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", translit: "Al-ḥamdu lillāh", meaning: "All praise is for Allah", target: 33, color: "#D9693B" },
  { id: "allahuakbar", arabic: "اللَّهُ أَكْبَرُ", translit: "Allāhu akbar", meaning: "Allah is the Greatest", target: 34, color: "#3B2E6E" },
];

export interface CardDef {
  id: string;
  title: string;
  scene: "makkah" | "cave" | "hira" | "quba" | "madinah" | "caravan";
  fact: string;
}

export const CARDS: CardDef[] = [
  { id: "makkah", title: "Makkah", scene: "makkah", fact: "The city where the Prophet ﷺ was born, home of the Kaaba." },
  { id: "hira", title: "Cave of Hira", scene: "hira", fact: "Where the first words of the Qur'an were revealed: “Read!”" },
  { id: "thawr", title: "Cave of Thawr", scene: "cave", fact: "The hiding place during the Hijrah, for three nights." },
  { id: "quba", title: "Masjid Quba", scene: "quba", fact: "The very first masjid, built on arrival near Madinah." },
  { id: "route", title: "The Secret Route", scene: "caravan", fact: "A trusted guide led them on paths few people knew." },
  { id: "madinah", title: "Madinah", scene: "madinah", fact: "The city that welcomed the Prophet ﷺ with joy." },
];

export interface Source {
  id: string;
  claim: string;
  ref: string;
  status: "approved" | "pending";
}

export const SOURCES: Source[] = [
  { id: "bukhari-3905", claim: "Leaving at night with Abu Bakr; three nights in the cave of Thawr; Amir ibn Fuhayrah's sheep nearby; the hired guide", ref: "Sahih al-Bukhari 3905", status: "pending" },
  { id: "tracks", claim: "The sheep covering the footprints", ref: "Sirah of Ibn Hisham", status: "pending" },
  { id: "bukhari-2979", claim: "Asma tearing her belt to tie the food bag (Dhat an-Nitaqayn)", ref: "Sahih al-Bukhari 2979", status: "pending" },
  { id: "bukhari-3653", claim: "“What do you think of two, when Allah is the third?”", ref: "Sahih al-Bukhari 3653; Sahih Muslim 2381", status: "pending" },
  { id: "quran-9-40", claim: "“Do not be sad, indeed Allah is with us.”", ref: "Qur'an 9:40", status: "approved" },
  { id: "bukhari-3906", claim: "People of Madinah waiting every morning; arrival at Quba; the first masjid", ref: "Sahih al-Bukhari 3906", status: "pending" },
  { id: "muslim-597", claim: "After-prayer tasbih: 33 / 33 / 34", ref: "Sahih Muslim 597", status: "pending" },
];
