// Story scenes for "The Night Journey to Safety" (the Hijrah).
// Art direction rule: the Prophet ﷺ and the Sahaba are NEVER shown.
// The story is told through places, light, objects, footprints and animals.
import { useId, type ReactNode } from "react";
import { motion } from "motion/react";

const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

function Stars({ n = 46, seed = 7, maxY = 150, w = 400 }: { n?: number; seed?: number; maxY?: number; w?: number }) {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = r() * w;
        const y = r() * maxY;
        const s = r() * 1.4 + 0.5;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={s}
            fill="#FFF8EC"
            className="animate-twinkle"
            style={{ animationDelay: `${(r() * 3).toFixed(2)}s`, transformOrigin: `${x}px ${y}px` }}
          />
        );
      })}
    </g>
  );
}

function Moon({ cx, cy, r = 16, glow = true }: { cx: number; cy: number; r?: number; glow?: boolean }) {
  const id = useId();
  return (
    <g>
      {glow && <circle cx={cx} cy={cy} r={r * 2.6} fill="#FFF3D1" opacity=".08" />}
      {glow && <circle cx={cx} cy={cy} r={r * 1.6} fill="#FFF3D1" opacity=".1" />}
      <mask id={`m${id}`}>
        <rect x={cx - r * 2} y={cy - r * 2} width={r * 4} height={r * 4} fill="#fff" />
        <circle cx={cx + r * 0.55} cy={cy - r * 0.25} r={r * 0.92} fill="#000" />
      </mask>
      <circle cx={cx} cy={cy} r={r} fill="#FFE9B0" mask={`url(#m${id})`} />
    </g>
  );
}

const Svg = ({ children, label }: { children: ReactNode; label: string }) => (
  <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="h-full w-full block" role="img" aria-label={label}>
    {children}
  </svg>
);

/* 1 — Makkah at night: a quiet departure */
export function MakkahNight() {
  const id = useId();
  const houses = [
    [40, 150, 46, 50], [80, 140, 40, 60], [116, 152, 44, 48], [232, 146, 42, 54], [268, 136, 50, 64], [312, 150, 44, 50], [350, 142, 50, 58],
    [150, 160, 34, 40], [196, 158, 38, 42],
  ];
  return (
    <Svg label="Makkah at night. Lamps glow in the houses and the Kaaba stands quietly in the middle.">
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E1330" />
          <stop offset=".6" stopColor="#2B2560" />
          <stop offset="1" stopColor="#4A3470" />
        </linearGradient>
        <radialGradient id={`door${id}`} cx=".5" cy="1" r=".9">
          <stop offset="0" stopColor="#F5B53F" stopOpacity=".55" />
          <stop offset="1" stopColor="#F5B53F" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#sky${id})`} />
      <Stars seed={11} maxY={130} />
      <Moon cx={330} cy={46} r={15} />
      <path d="M0 150 L40 112 L80 132 L130 92 L180 124 L220 104 L270 128 L320 96 L370 122 L400 110 V260 H0Z" fill="#1C2250" />
      <path d="M0 168 L60 140 L120 158 L190 132 L250 156 L320 136 L400 154 V260 H0Z" fill="#232A5E" />
      {houses.map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill={i % 2 ? "#3A3F78" : "#454B8A"} />
          <rect x={x - 2} y={y - 3} width={w + 4} height={4} fill="#2E3268" />
          <rect x={x + w * 0.25} y={y + h * 0.28} width={5} height={7} rx="1" fill="#F5B53F" opacity={i % 3 === 0 ? 0.25 : 0.85} className={i % 4 === 1 ? "animate-twinkle" : ""} />
          <rect x={x + w * 0.62} y={y + h * 0.28} width={5} height={7} rx="1" fill="#F5B53F" opacity={i % 2 ? 0.8 : 0.3} />
        </g>
      ))}
      {/* the Kaaba, small and calm in the distance */}
      <g transform="translate(176 150)">
        <rect x="0" y="0" width="34" height="32" fill="#14141C" />
        <rect x="0" y="7" width="34" height="4" fill="#D4A537" />
        <rect x="22" y="16" width="6" height="16" fill="#D4A537" opacity=".8" />
      </g>
      {/* ground */}
      <rect x="0" y="198" width="400" height="62" fill="#2A2350" />
      {/* a house with the door slightly open: the journey begins */}
      <g>
        <rect x="18" y="176" width="92" height="70" fill="#4E4A8F" />
        <rect x="14" y="172" width="100" height="6" fill="#3A3F78" />
        <rect x="54" y="206" width="22" height="40" fill="#1A1838" />
        <motion.path
          d="M62 206 L76 206 L76 246 L62 246 Z"
          fill="#F5B53F"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <path d="M62 246 L76 246 L120 260 L40 260 Z" fill={`url(#door${id})`} />
      </g>
      <path d="M0 246 C80 240 160 252 240 246 C300 242 360 250 400 246 V260 H0Z" fill="#221D44" />
    </Svg>
  );
}

/* 2 — Footprints towards Mount Thawr */
export function FootprintsToThawr({ show = 10 }: { show?: number }) {
  const id = useId();
  const steps = Array.from({ length: 10 }, (_, i) => {
    const t = i / 9;
    const x = 60 + t * 220 + Math.sin(t * 5) * 14;
    const y = 238 - t * 92;
    const s = 1 - t * 0.55;
    return { x, y, s };
  });
  return (
    <Svg label="Two trails of footprints cross the moonlit sand towards Mount Thawr, where a small cave waits.">
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#101639" />
          <stop offset="1" stopColor="#38306A" />
        </linearGradient>
        <linearGradient id={`sand${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7E6E9E" />
          <stop offset="1" stopColor="#56497A" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#sky${id})`} />
      <Stars seed={23} maxY={120} />
      <Moon cx={74} cy={52} r={20} />
      {/* Mount Thawr */}
      <path d="M190 160 L250 70 L276 84 L300 58 L352 112 L400 140 V180 H190Z" fill="#2A2554" />
      <path d="M250 70 L276 84 L300 58 L318 76 L300 90 L276 100 L262 92Z" fill="#3B3570" />
      <path d="M290 108 C298 100 312 100 318 110 C318 118 296 120 290 108Z" fill="#0B0A1C" />
      <circle cx="304" cy="110" r="22" fill="#F5B53F" opacity=".06" />
      {/* dunes */}
      <path d="M0 170 C80 150 160 176 240 160 C300 150 360 164 400 156 V260 H0Z" fill={`url(#sand${id})`} />
      <path d="M0 214 C90 196 180 222 260 206 C320 196 370 210 400 204 V260 H0Z" fill="#6A5B8E" opacity=".8" />
      {/* footprints, revealed one by one */}
      {steps.map((p, i) =>
        i < show ? (
          <motion.g key={i} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 0.9, scale: 1 }} transition={{ delay: i * 0.18 }} style={{ transformOrigin: `${p.x}px ${p.y}px` }}>
            <g transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
              <ellipse cx="-9" cy={i % 2 ? -3 : 3} rx="3.2" ry="6" fill="#3E3466" />
              <ellipse cx="-1" cy={i % 2 ? 3 : -3} rx="3.2" ry="6" fill="#3E3466" />
              <ellipse cx="11" cy={i % 2 ? -2 : 4} rx="3.2" ry="6" fill="#3E3466" />
              <ellipse cx="19" cy={i % 2 ? 4 : -2} rx="3.2" ry="6" fill="#3E3466" />
            </g>
          </motion.g>
        ) : null,
      )}
    </Svg>
  );
}

/* 3 — Inside the cave: Asma's food bundle tied with half her belt */
export function CaveInside({ glow = false }: { glow?: boolean }) {
  const id = useId();
  return (
    <Svg label="Inside the cave at night. Moonlight falls on a food bundle tied with a striped belt, next to a water skin.">
      <defs>
        <linearGradient id={`out${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A2350" />
          <stop offset="1" stopColor="#3B2E6E" />
        </linearGradient>
        <radialGradient id={`beam${id}`} cx=".5" cy="0" r="1">
          <stop offset="0" stopColor="#FFF3D1" stopOpacity=".35" />
          <stop offset="1" stopColor="#FFF3D1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#out${id})`} />
      <g transform="translate(110 0)">
        <Stars n={22} seed={31} maxY={150} w={190} />
      </g>
      <Moon cx={250} cy={60} r={12} />
      {/* rock frame with irregular cave mouth */}
      <path
        d="M0 0 H400 V260 H0Z M120 210 C110 160 118 110 140 80 C160 50 200 36 236 44 C270 52 296 82 300 120 C304 160 294 196 286 214 Z"
        fill="#1B1530"
        fillRule="evenodd"
      />
      <path d="M140 80 C150 70 162 62 176 58 M262 64 C276 74 288 90 294 106 M120 150 C122 130 126 112 134 96" stroke="#2E2650" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M0 40 C30 50 50 30 80 46 M330 30 C350 40 370 24 400 34 M20 120 C40 128 60 116 84 126 M320 160 C340 170 360 158 400 168" stroke="#251E40" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* floor */}
      <path d="M0 214 C100 204 300 204 400 214 V260 H0Z" fill="#2A2246" />
      {/* moonbeam */}
      <path d="M180 120 L250 120 L300 260 L130 260 Z" fill={`url(#beam${id})`} />
      {/* water skin */}
      <g transform="translate(250 196)">
        <path d="M0 18 C-6 4 4 -10 18 -8 C34 -6 40 10 34 22 C28 32 6 32 0 18Z" fill="#8C5A2B" />
        <path d="M14 -8 l4 -8 l6 2 l-2 8" fill="#6E4520" />
        <path d="M6 12 C14 18 26 18 32 12" stroke="#A86F36" strokeWidth="2" fill="none" />
      </g>
      {/* food bundle tied with a striped belt (Asma, "the one with two belts") */}
      <g transform="translate(170 188)">
      <motion.g
        animate={glow ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1.6, repeat: Infinity }}
        style={{ transformOrigin: "22px 18px" }}
      >
        {glow && <ellipse cx="22" cy="18" rx="46" ry="30" fill="#F5B53F" opacity=".22" />}
        <path d="M-6 30 C-10 10 6 -4 22 -2 C40 0 54 12 48 30 C42 42 2 44 -6 30Z" fill="#E9D3A6" />
        <path d="M4 6 C10 14 34 16 42 6" stroke="#CDB081" strokeWidth="2" fill="none" />
        <path d="M10 -1 C16 -12 28 -12 34 -1" fill="#E9D3A6" />
        <g>
          <path d="M8 4 L38 4 L38 11 L8 11 Z" fill="#D9693B" />
          <path d="M8 6.2 H38 M8 8.8 H38" stroke="#F5B53F" strokeWidth="1.4" />
          <path d="M38 4 L52 -2 L54 5 L39 11 Z" fill="#D9693B" />
          <path d="M39 6 L52 1 M39 9 L53 3.5" stroke="#F5B53F" strokeWidth="1.2" />
        </g>
      </motion.g>
      </g>
    </Svg>
  );
}

/* 4 — The searchers at the cave entrance (seen from inside) */
export function CaveEntrance({ safe = false }: { safe?: boolean }) {
  const id = useId();
  return (
    <Svg label={safe ? "The searchers have gone. Only calm moonlight remains at the cave entrance." : "Torchlight and the feet of searchers appear right outside the cave entrance."}>
      <defs>
        <radialGradient id={`torch${id}`} cx=".5" cy=".75" r=".7">
          <stop offset="0" stopColor="#F5B53F" stopOpacity=".75" />
          <stop offset=".6" stopColor="#D9693B" stopOpacity=".25" />
          <stop offset="1" stopColor="#D9693B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`out${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A2350" />
          <stop offset="1" stopColor="#40306E" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#out${id})`} />
      <g transform="translate(110 10)">
        <Stars n={18} seed={41} maxY={100} w={180} />
      </g>
      <motion.rect width="400" height="260" fill={`url(#torch${id})`} animate={{ opacity: safe ? 0 : [0.7, 1, 0.75, 1] }} transition={safe ? { duration: 1.2 } : { duration: 1.4, repeat: Infinity }} />
      {/* searchers outside: only robe hems and sandals, as silhouettes */}
      <motion.g animate={{ opacity: safe ? 0 : 1, x: safe ? 60 : 0 }} transition={{ duration: 1.6 }}>
        {[150, 202, 250].map((x, i) => (
          <g key={i} transform={`translate(${x} ${120 + (i % 2) * 8})`}>
            <motion.g animate={{ rotate: [0, i % 2 ? 1.2 : -1.2, 0] }} transition={{ duration: 2.4 + i * 0.4, repeat: Infinity }} style={{ transformOrigin: "13px 0px" }}>
              <path d="M2 0 C0 30 -6 58 -10 82 Q12 89 36 82 C32 58 28 30 26 0 Z" fill="#120E22" />
              <path d="M10 10 C9 40 6 62 4 84 M18 10 C19 40 22 62 24 84" stroke="#241C3E" strokeWidth="2" fill="none" />
              <path d="M-8 86 q6 -6 13 0 z M21 86 q6 -6 13 0 z" fill="#0B0816" />
            </motion.g>
          </g>
        ))}
        {/* torch held outside */}
        <g>
          <path d="M184 96 L176 140" stroke="#3A2A1E" strokeWidth="4" strokeLinecap="round" />
          <motion.path d="M184 96 C176 88 180 76 186 70 C188 80 196 84 190 96 Z" fill="#F5B53F" animate={{ scaleY: [1, 1.15, 0.95, 1.1, 1] }} transition={{ duration: 0.7, repeat: Infinity }} style={{ transformOrigin: "184px 96px" }} />
          <path d="M184 94 C180 88 182 82 185 79 C186 84 189 87 187 94 Z" fill="#FFF3D1" />
        </g>
      </motion.g>
      {/* rock frame */}
      <path
        d="M0 0 H400 V260 H0Z M110 216 C104 168 116 120 140 92 C162 66 204 54 236 62 C268 70 292 96 296 134 C300 170 292 200 286 218 Z"
        fill="#17122A"
        fillRule="evenodd"
      />
      <path d="M140 92 C152 80 166 72 182 68 M262 74 C278 86 290 104 294 124" stroke="#2A2248" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M0 218 C100 210 300 210 400 218 V260 H0Z" fill="#241D40" />
      {safe && (
        <motion.circle cx="250" cy="74" r="10" fill="#FFE9B0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }} />
      )}
    </Svg>
  );
}

/* 5 — Dawn at Quba / Madinah: a joyful welcome (no people shown) */
export function MadinahDawn() {
  const id = useId();
  const palms = [[30, 176, 1], [86, 168, 0.8], [328, 170, 1], [372, 178, 0.85], [244, 166, 0.7]];
  return (
    <Svg label="Sunrise over the palm groves of Madinah. Houses are decorated with colourful flags to welcome the travellers.">
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9FD3E8" />
          <stop offset=".55" stopColor="#FFE2B0" />
          <stop offset="1" stopColor="#F7B267" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#sky${id})`} />
      <motion.g initial={{ y: 30 }} animate={{ y: 0 }} transition={{ duration: 3, ease: "easeOut" }}>
        <circle cx="200" cy="150" r="58" fill="#FFF3D1" opacity=".5" />
        <circle cx="200" cy="150" r="38" fill="#FFD27A" />
      </motion.g>
      {/* birds */}
      {[[90, 60], [120, 46], [290, 52], [312, 68]].map(([x, y], i) => (
        <motion.path
          key={i}
          d={`M${x} ${y} q6 -6 12 0 q6 -6 12 0`}
          stroke="#3B2E6E"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ x: [0, 14, 0], y: [0, -6, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <path d="M0 176 C80 160 160 172 240 162 C300 156 360 166 400 160 V260 H0Z" fill="#E7B877" />
      {/* houses */}
      {[[110, 168, 44, 38], [150, 160, 52, 46], [204, 168, 40, 38], [258, 164, 48, 42]].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill={i % 2 ? "#D9A86C" : "#E6BC84"} />
          <rect x={x - 2} y={y - 3} width={w + 4} height={4} fill="#C98F4E" />
          <rect x={x + w / 2 - 5} y={y + h - 16} width={10} height={16} rx="5" fill="#8C5A2B" />
        </g>
      ))}
      {/* bunting */}
      <path d="M40 120 Q140 150 250 128 Q310 118 360 124" stroke="#8C5A2B" strokeWidth="1.5" fill="none" />
      {Array.from({ length: 14 }, (_, i) => {
        const t = i / 13;
        const x = 40 + t * 320;
        const y = 120 + Math.sin(t * Math.PI) * 18 + (t > 0.66 ? -6 : 0);
        const c = ["#D9693B", "#1F8A85", "#F5B53F", "#E86A7F"][i % 4];
        return <path key={i} d={`M${x - 6} ${y} L${x + 6} ${y} L${x} ${y + 11}Z`} fill={c} />;
      })}
      {/* palms */}
      {palms.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M0 80 C-2 50 2 20 6 0" stroke="#8C5A2B" strokeWidth="7" fill="none" strokeLinecap="round" />
          <g fill="#3E8E5A">
            <path d="M6 0 C-8 -14 -28 -12 -40 0 C-22 -4 -8 -2 6 2z" />
            <path d="M6 0 C22 -18 42 -14 48 0 C32 -6 18 -4 6 2z" />
            <path d="M6 -2 C2 -20 8 -34 20 -40 C14 -26 12 -14 8 0z" />
          </g>
        </g>
      ))}
      <path d="M0 236 C100 226 300 230 400 222 V260 H0Z" fill="#D9A15E" />
    </Svg>
  );
}

/* 6 — A Madinah street by day: the camel kneels on open land; Abu Ayyub's door glows (no people shown) */
export function MadinahStreet() {
  const id = useId();
  return (
    <Svg label="A street in Madinah by day. A camel kneels on an open piece of land, next to a house whose door glows warmly.">
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A9DAEE" />
          <stop offset="1" stopColor="#FFE8C2" />
        </linearGradient>
        <radialGradient id={`door${id}`} cx=".5" cy=".7" r=".6">
          <stop offset="0" stopColor="#FFD27A" stopOpacity=".9" />
          <stop offset="1" stopColor="#FFD27A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#sky${id})`} />
      <circle cx="334" cy="48" r="40" fill="#FFF3D1" opacity=".55" />
      <circle cx="334" cy="48" r="22" fill="#FFD27A" />
      {[[70, 50], [96, 38], [210, 44]].map(([x, y], i) => (
        <motion.path key={i} d={`M${x} ${y} q6 -6 12 0 q6 -6 12 0`} stroke="#3B2E6E" strokeWidth="2" fill="none" strokeLinecap="round"
          animate={{ x: [0, 12, 0], y: [0, -5, 0] }} transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }} />
      ))}
      <path d="M0 150 C70 132 140 148 210 136 C280 126 340 142 400 134 V200 H0Z" fill="#E7C08A" />
      {/* back houses */}
      {[[10, 120, 50, 50], [54, 128, 44, 42], [300, 124, 46, 46], [342, 116, 58, 54]].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill={i % 2 ? "#D9A86C" : "#E2B37A"} />
          <rect x={x - 2} y={y - 3} width={w + 4} height={4} fill="#C98F4E" />
          <rect x={x + w / 2 - 4} y={y + 12} width="8" height="9" fill="#8C5A2B" opacity=".7" />
        </g>
      ))}
      {/* bunting */}
      <path d="M20 96 Q120 122 240 104 Q320 94 390 100" stroke="#8C5A2B" strokeWidth="1.5" fill="none" />
      {Array.from({ length: 13 }, (_, i) => {
        const t = i / 12;
        const x = 20 + t * 370;
        const y = 96 + Math.sin(t * Math.PI) * 18 - (t > 0.6 ? 4 : 0);
        return <path key={i} d={`M${x - 6} ${y} L${x + 6} ${y} L${x} ${y + 11}Z`} fill={["#D9693B", "#1F8A85", "#F5B53F", "#E86A7F"][i % 4]} />;
      })}
      {/* street */}
      <path d="M0 196 C100 186 300 186 400 196 V260 H0Z" fill="#E9CC98" />
      {/* open land: the future masjid site, marked with stones */}
      <path d="M40 214 L190 214 L178 246 L28 246 Z" fill="#F2DDB0" />
      {[[44, 216], [92, 214], [140, 214], [186, 216], [30, 244], [104, 246], [176, 244]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="5" ry="3" fill="#C9A26E" />
      ))}
      {/* palms */}
      {[[18, 200, 0.9], [384, 204, 0.85]].map(([x, y, sc], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${sc})`}>
          <path d="M0 0 C-2 -30 2 -60 6 -84" stroke="#8C5A2B" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M6 -84 C-8 -98 -28 -96 -40 -84 C-22 -88 -8 -86 6 -82z M6 -84 C22 -102 42 -98 48 -84 C32 -90 18 -88 6 -82z M6 -86 C2 -104 8 -118 20 -124 C14 -110 12 -98 8 -84z" fill="#3E8E5A" />
        </g>
      ))}
      {/* Abu Ayyub's house, the door glowing warmly */}
      <g>
        <rect x="236" y="138" width="92" height="66" fill="#E6BC84" />
        <rect x="232" y="134" width="100" height="6" fill="#C98F4E" />
        <rect x="252" y="152" width="14" height="14" fill="#8C5A2B" opacity=".8" />
        <circle cx="290" cy="186" r="40" fill={`url(#door${id})`} />
        <motion.rect x="280" y="166" width="20" height="38" rx="10" fill="#FFD27A" animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 3, repeat: Infinity }} />
        <path d="M314 204 h10 l-2 -12 h-6z" fill="#B4502A" />
        <path d="M319 192 c-6 -6 -6 -12 0 -16 c6 4 6 10 0 16z" fill="#3E8E5A" />
      </g>
      {/* the camel, kneeling (no rider shown) */}
      <g transform="translate(92 176)">
        <ellipse cx="34" cy="42" rx="40" ry="5" fill="#000" opacity=".1" />
        <path d="M2 30 C2 18 12 14 18 14 C22 0 40 0 44 14 C54 14 60 20 60 30 C60 38 50 42 31 42 C12 42 2 38 2 30Z" fill="#C98F4E" />
        <path d="M18 14 C24 10 38 10 44 14 L44 24 C36 27 26 27 18 24Z" fill="#1F8A85" />
        <path d="M18 19 h26" stroke="#F5B53F" strokeWidth="2.4" />
        <rect x="8" y="36" width="20" height="7" rx="3.5" fill="#B07A3E" />
        <rect x="36" y="36" width="20" height="7" rx="3.5" fill="#B07A3E" />
        <path d="M56 24 C64 18 64 8 68 0 L76 3 C72 12 72 22 64 30Z" fill="#C98F4E" />
        <ellipse cx="76" cy="0" rx="9" ry="6" fill="#C98F4E" />
        <ellipse cx="83" cy="3" rx="5" ry="4" fill="#D9A86C" />
        <circle cx="75" cy="-2" r="1.6" fill="#2B2140" />
        <ellipse cx="70" cy="-6" rx="2" ry="3.4" transform="rotate(-25 70 -6)" fill="#A86F36" />
      </g>
    </Svg>
  );
}

/* Small illustrations for cards (sequence game, collection, home) */
export function MiniScene({ kind, align = "mid" }: { kind: "makkah" | "cave" | "caravan" | "madinah" | "hira" | "quba"; align?: "mid" | "bottom" }) {
  const id = useId();
  const night = kind === "makkah" || kind === "cave" || kind === "hira";
  return (
    <svg viewBox="0 0 120 90" className="h-full w-full block" preserveAspectRatio={align === "bottom" ? "xMidYMax slice" : "xMidYMid slice"} aria-hidden="true">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          {night ? (
            <>
              <stop offset="0" stopColor="#141B3D" />
              <stop offset="1" stopColor="#3B2E6E" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#9FD3E8" />
              <stop offset="1" stopColor="#FFE2B0" />
            </>
          )}
        </linearGradient>
      </defs>
      <rect width="120" height="90" fill={`url(#g${id})`} />
      {night && <Stars n={12} seed={kind.length * 13} maxY={40} w={120} />}
      {kind === "makkah" && (
        <>
          <path d="M0 60 L30 42 L60 54 L90 38 L120 52 V90 H0Z" fill="#232A5E" />
          {[[8, 58, 20, 24], [30, 54, 18, 28], [74, 56, 22, 26], [96, 60, 20, 22]].map(([x, y, w, h], i) => (
            <g key={i}><rect x={x} y={y} width={w} height={h} fill="#454B8A" /><rect x={x + 6} y={y + 8} width="3" height="4" fill="#F5B53F" /></g>
          ))}
          <rect x="52" y="60" width="16" height="16" fill="#14141C" /><rect x="52" y="64" width="16" height="2.5" fill="#D4A537" />
          <rect y="76" width="120" height="14" fill="#2A2350" />
        </>
      )}
      {(kind === "cave" || kind === "hira") && (
        <>
          <Moon cx={kind === "cave" ? 24 : 96} cy={20} r={8} glow={false} />
          <path d="M10 90 L46 34 L60 42 L74 26 L112 70 L120 90Z" fill="#2A2554" />
          <path d="M46 34 L60 42 L74 26 L84 38 L72 48 L58 52Z" fill="#3B3570" />
          <path d="M62 64 C66 58 76 58 80 64 C80 70 64 70 62 64Z" fill="#0B0A1C" />
          {kind === "hira" && <circle cx="71" cy="64" r="14" fill="#F5B53F" opacity=".3" />}
          <path d="M0 80 C40 72 80 84 120 76 V90 H0Z" fill="#56497A" />
        </>
      )}
      {kind === "caravan" && (
        <>
          <circle cx="92" cy="30" r="12" fill="#FFD27A" />
          <path d="M0 62 C40 50 80 66 120 56 V90 H0Z" fill="#E7B877" />
          {[26, 64].map((x) => (
            <g key={x} transform={`translate(${x} 44)`}>
              <path d="M0 20 C0 12 6 10 10 10 C12 2 20 2 22 10 C28 10 30 14 30 20 C30 24 24 26 15 26 C6 26 0 24 0 20Z" fill="#C98F4E" />
              <path d="M28 14 C32 10 32 4 34 0 L38 2 C36 8 36 14 32 18Z" fill="#C98F4E" />
              <ellipse cx="38" cy="1" rx="5" ry="3.5" fill="#C98F4E" />
              <rect x="4" y="24" width="3" height="10" fill="#A86F36" /><rect x="22" y="24" width="3" height="10" fill="#A86F36" />
            </g>
          ))}
          <path d="M0 78 C40 70 80 82 120 74 V90 H0Z" fill="#D9A15E" />
        </>
      )}
      {(kind === "madinah" || kind === "quba") && (
        <>
          <circle cx="60" cy="56" r="16" fill="#FFD27A" />
          <path d="M0 62 C40 54 80 62 120 56 V90 H0Z" fill="#E7B877" />
          {kind === "quba" ? (
            <g>
              <rect x="34" y="50" width="52" height="24" fill="#E6BC84" />
              <rect x="30" y="46" width="60" height="5" fill="#8C5A2B" />
              {[38, 50, 62, 74].map((x) => <rect key={x} x={x} y="51" width="4" height="23" fill="#8C5A2B" />)}
            </g>
          ) : (
            [[20, 56, 18, 20], [42, 52, 22, 24], [70, 56, 18, 20]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#D9A86C" />)
          )}
          {[8, 104].map((x) => (
            <g key={x} transform={`translate(${x} 46)`}>
              <path d="M0 40 C-1 26 1 12 3 0" stroke="#8C5A2B" strokeWidth="3.5" fill="none" />
              <path d="M3 0 C-4 -7 -14 -6 -20 0 C-11 -2 -4 -1 3 1z M3 0 C11 -9 21 -7 24 0 C16 -3 9 -2 3 1z M3 -1 C1 -10 4 -17 10 -20 C7 -13 6 -7 4 0z" fill="#3E8E5A" />
            </g>
          ))}
          <path d="M0 80 C40 74 80 84 120 76 V90 H0Z" fill="#D9A15E" />
        </>
      )}
    </svg>
  );
}
