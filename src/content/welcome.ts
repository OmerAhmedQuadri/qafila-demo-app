// "Madinah Welcomes" — Episode 6, published from the Studio in the demo.
// Every fact is tied to a source (see sources in data.ts). Status in the demo: scholar review pending.
import type { Step } from "./hijrah";

export const WELCOME_TITLE = "Madinah Welcomes";

export const welcomeSteps: Step[] = [
  {
    kind: "story",
    scene: "madinah",
    title: "The city that waited",
    lines: [
      "Every morning, the people of Madinah had gone out to watch the road, hoping to see the travellers.",
      "And then, one day, they arrived! Men, women and children came out into the streets with joy.",
      "A companion said he had never seen the people of Madinah happier about anything!",
    ],
    source: "bukhari-3925",
  },
  {
    kind: "story",
    scene: "madinahStreet",
    title: "Where will he stay?",
    lines: [
      "Everyone hoped the Prophet ﷺ would stay with them.",
      "His camel walked through the city and knelt down on an open piece of land. Later, his masjid was built right there.",
      "Abu Ayyub al-Ansari (RA) lived closest. “This is my house, and this is my door!” he said happily. So the Prophet ﷺ stayed with him.",
    ],
    source: "bukhari-3911",
  },
  {
    kind: "quiz",
    q: "How did the people of Madinah feel when the Prophet ﷺ arrived?",
    options: [{ text: "A little bored" }, { text: "Happier than ever!", correct: true }, { text: "Too busy to notice" }],
    explain: "A companion said he had never seen them happier about anything.",
  },
  {
    kind: "quiz",
    q: "Where did the camel kneel down?",
    options: [{ text: "Next to the market" }, { text: "Where his masjid was later built", correct: true }, { text: "Outside the city" }],
    explain: "That open land became the place of the Prophet's ﷺ masjid in Madinah.",
  },
  {
    kind: "choose",
    kicker: "Live it!",
    title: "Welcome like the people of Madinah",
    prompt: "A guest is coming to your home today. How will you welcome them?",
    options: [
      { id: "salaam", label: "Say salaam with a big smile", icon: "salaam" },
      { id: "water", label: "Offer a glass of water", icon: "water" },
      { id: "share", label: "Share my snack", icon: "share" },
      { id: "seat", label: "Give them the best seat", icon: "seat" },
    ],
    response: "That's how the people of Madinah welcomed: with open hearts!",
    quote: { text: "“Whoever believes in Allah and the Last Day, let him honour his guest.”", ref: "The Prophet ﷺ · Sahih al-Bukhari 6018" },
    cta: "I'll welcome my guests",
  },
  { kind: "complete" },
];
