// "The Night Journey to Safety" — sample unit for ages 8–10.
// Every fact is tied to a source (see sources.ts). Status in the demo: scholar review pending.

export type SceneKind = "makkah" | "footprints" | "caveInside" | "caveEntrance" | "madinah";

export type Step =
  | { kind: "story"; scene: SceneKind; title: string; lines: string[]; ayah?: boolean; source: string }
  | { kind: "tracks" }
  | { kind: "quiz"; q: string; options: { text: string; correct?: boolean }[]; explain: string }
  | { kind: "sequence" }
  | { kind: "colour" }
  | { kind: "reflect" }
  | { kind: "liveit" }
  | { kind: "complete" };

export const HIJRAH_TITLE = "The Night Journey to Safety";

export const hijrahSteps: Step[] = [
  {
    kind: "story",
    scene: "makkah",
    title: "A quiet night in Makkah",
    lines: [
      "Life in Makkah had become very hard for the Muslims. Many people were cruel to them.",
      "So Allah gave permission to move to Madinah, where the people were waiting with open hearts.",
      "One night, the Prophet Muhammad ﷺ and his best friend Abu Bakr (RA) quietly set out.",
    ],
    source: "bukhari-3905",
  },
  {
    kind: "story",
    scene: "footprints",
    title: "A clever plan",
    lines: [
      "Madinah was to the north. But they went south first, to a rocky mountain called Thawr.",
      "High up was a small cave. It was the perfect place to hide.",
      "But look… their footprints were left behind in the sand!",
    ],
    source: "bukhari-3905",
  },
  { kind: "tracks" },
  {
    kind: "story",
    scene: "caveInside",
    title: "Three nights in the cave",
    lines: [
      "They stayed in the cave for three nights.",
      "Abu Bakr's daughter, Asma (RA), bravely brought them food.",
      "She had nothing to tie the food bag with, so she tore her belt in two! From then on, she was called “the one with two belts”.",
    ],
    source: "bukhari-2979",
  },
  {
    kind: "story",
    scene: "caveEntrance",
    title: "Footsteps outside!",
    lines: [
      "One day, the searchers came right up to the cave. Abu Bakr (RA) could see their feet!",
      "He whispered, worried: “If one of them looks down, he will see us.”",
      "The Prophet ﷺ answered calmly:",
    ],
    ayah: true,
    source: "quran-9-40",
  },
  {
    kind: "quiz",
    q: "How many nights did they stay in the cave?",
    options: [{ text: "One night" }, { text: "Three nights", correct: true }, { text: "Ten nights" }],
    explain: "They stayed three nights, until the searchers gave up.",
  },
  {
    kind: "quiz",
    q: "Who brought food and tied the bag with her belt?",
    options: [{ text: "A traveller" }, { text: "Asma (RA)", correct: true }, { text: "Amir's sheep" }],
    explain: "Asma (RA) tore her belt in two. She is remembered as “the one with two belts”.",
  },
  {
    kind: "quiz",
    q: "What did the Prophet ﷺ say when Abu Bakr (RA) was worried?",
    options: [
      { text: "“Let's go back home.”" },
      { text: "“Do not be sad. Allah is with us.”", correct: true },
      { text: "“Let's hide deeper.”" },
    ],
    explain: "He reminded his friend that Allah was with them. That's in the Qur'an (9:40)!",
  },
  {
    kind: "story",
    scene: "madinah",
    title: "Madinah is waiting!",
    lines: [
      "After the cave, a guide led them along a secret route across the desert.",
      "In Madinah, people went out every morning to watch for them, until the sun got too hot.",
      "Then one day… they arrived! Hearts filled with joy. At Quba, the very first masjid was built.",
    ],
    source: "bukhari-3906",
  },
  { kind: "sequence" },
  { kind: "colour" },
  { kind: "reflect" },
  { kind: "liveit" },
  { kind: "complete" },
];

export const AYAH = {
  arabic: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
  translit: "Lā taḥzan, innallāha maʿanā",
  meaning: "“Do not be sad. Indeed, Allah is with us.”",
  ref: "Qur'an, Surah At-Tawbah 9:40",
};

export const SEQUENCE = [
  { id: "makkah", label: "Leave Makkah at night" },
  { id: "cave", label: "Hide in the cave of Thawr" },
  { id: "caravan", label: "Cross the desert with a guide" },
  { id: "madinah", label: "Arrive at Quba & Madinah" },
] as const;
