import type { ReactNode } from "react";

// Tamr — the baby camel who travels with the child through the Seerah journey.
// Child avatars — fictional present-day children (faces allowed for fictional characters).

type Mood = "happy" | "wow" | "think" | "sleep" | "cheer";

export function Tamr({ size = 120, mood = "happy", className = "" }: { size?: number; mood?: Mood; className?: string }) {
  const eye =
    mood === "sleep" ? (
      <path d="M95 32 q4 3 8 0" stroke="#2B2140" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    ) : mood === "wow" ? (
      <>
        <circle cx="99" cy="31" r="4.6" fill="#2B2140" />
        <circle cx="100.6" cy="29.4" r="1.6" fill="#fff" />
      </>
    ) : mood === "think" ? (
      <>
        <circle cx="100" cy="30" r="3.6" fill="#2B2140" />
        <circle cx="101.2" cy="28.8" r="1.2" fill="#fff" />
      </>
    ) : (
      <>
        <circle cx="99" cy="31" r="3.8" fill="#2B2140" />
        <circle cx="100.4" cy="29.6" r="1.4" fill="#fff" />
      </>
    );
  const mouth =
    mood === "wow" ? (
      <ellipse cx="111" cy="46" rx="2.6" ry="3.2" fill="#7A3B2E" />
    ) : mood === "think" ? (
      <path d="M106 46 q4 -1 8 1" stroke="#7A3B2E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    ) : (
      <path d="M105 44.5 q5 5 10 0" stroke="#7A3B2E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    );

  return (
    <svg viewBox="0 0 130 120" width={size} height={size * (120 / 130)} className={className} role="img" aria-label="Tamr the baby camel">
      {/* shadow */}
      <ellipse cx="62" cy="112" rx="40" ry="5" fill="#000" opacity=".12" />
      {/* tail */}
      <path d="M29 70 q-9 6 -6 16" stroke="#C98F4E" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="23" cy="87" r="3.2" fill="#A86F36" />
      {/* back legs */}
      <rect x="38" y="84" width="9" height="24" rx="4.5" fill="#C98F4E" />
      <rect x="50" y="86" width="9" height="22" rx="4.5" fill="#D9A15E" />
      {/* body + hump */}
      <path d="M30 76 C30 60 40 56 46 56 C52 36 72 36 78 56 C88 56 96 62 96 74 C96 88 82 92 63 92 C42 92 30 88 30 76 Z" fill="#E8B97A" />
      <path d="M42 84 C52 90 76 90 88 83" stroke="#F6DDB0" strokeWidth="6" fill="none" strokeLinecap="round" opacity=".7" />
      {/* saddle blanket */}
      <path d="M50 58 C56 52 70 52 76 58 L78 74 C68 78 58 78 48 74 Z" fill="#1F8A85" />
      <path d="M49 66 L77 66" stroke="#F5B53F" strokeWidth="3" />
      <path d="M51 71 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4" stroke="#FFF8EC" strokeWidth="1.6" fill="none" />
      <circle cx="63" cy="60" r="2.4" fill="#F5B53F" />
      {/* front legs */}
      <rect x="72" y="86" width="9" height="22" rx="4.5" fill="#D9A15E" />
      <rect x="84" y="84" width="9" height="24" rx="4.5" fill="#C98F4E" />
      {/* neck */}
      <path d="M86 66 C92 58 90 46 94 38 L106 42 C102 52 104 62 96 74 Z" fill="#E8B97A" />
      {/* head */}
      <ellipse cx="101" cy="34" rx="15" ry="12.5" fill="#E8B97A" />
      <ellipse cx="111" cy="42" rx="10" ry="7.5" fill="#F3D2A0" />
      <ellipse cx="114.5" cy="39.5" rx="1.3" ry="1.8" fill="#7A3B2E" />
      {/* ear + tuft */}
      <ellipse cx="91" cy="24" rx="3.6" ry="6" transform="rotate(-25 91 24)" fill="#C98F4E" />
      <path d="M97 22 q2 -6 6 -3 q1 -5 5 -1" stroke="#A86F36" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {eye}
      <path d="M95 26.5 q3 -2 7 -1" stroke="#2B2140" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* cheek */}
      <circle cx="103" cy="40" r="3" fill="#E86A7F" opacity=".35" />
      {mouth}
      {mood === "cheer" && (
        <g stroke="#F5B53F" strokeWidth="3" strokeLinecap="round">
          <path d="M118 16 l4 -6" />
          <path d="M124 24 l7 -2" />
          <path d="M110 12 l1 -7" />
        </g>
      )}
    </svg>
  );
}

export type AvatarKind = "ayaan" | "zara";

export function KidAvatar({ kind, size = 72 }: { kind: AvatarKind; size?: number }) {
  if (kind === "zara")
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Zara's avatar">
        <circle cx="50" cy="50" r="50" fill="#FCE3C4" />
        <path d="M18 100 C18 76 32 66 50 66 C68 66 82 76 82 100 Z" fill="#E86A7F" />
        {/* hijab */}
        <path d="M24 52 C24 28 36 18 50 18 C64 18 76 28 76 52 C76 70 66 80 50 82 C34 80 24 70 24 52 Z" fill="#D9693B" />
        <ellipse cx="50" cy="51" rx="18" ry="20" fill="#B87B54" />
        <path d="M32 46 C34 30 66 30 68 46" stroke="#D9693B" strokeWidth="6" fill="none" />
        <circle cx="43" cy="50" r="2.8" fill="#2B2140" />
        <circle cx="57" cy="50" r="2.8" fill="#2B2140" />
        <circle cx="44" cy="49" r=".9" fill="#fff" />
        <circle cx="58" cy="49" r=".9" fill="#fff" />
        <path d="M44 59 q6 5 12 0" stroke="#7A3B2E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="39" cy="56" r="3" fill="#E86A7F" opacity=".35" />
        <circle cx="61" cy="56" r="3" fill="#E86A7F" opacity=".35" />
        <path d="M30 70 l6 -3 6 3 6 -3 6 3 6 -3 6 3 6 -3" stroke="#F5B53F" strokeWidth="2" fill="none" />
      </svg>
    );
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Ayaan's avatar">
      <circle cx="50" cy="50" r="50" fill="#CDEEE4" />
      <path d="M18 100 C18 76 32 66 50 66 C68 66 82 76 82 100 Z" fill="#1F8A85" />
      <path d="M44 66 l6 8 6 -8" fill="#FFF8EC" />
      <ellipse cx="50" cy="48" rx="20" ry="22" fill="#A8704A" />
      <ellipse cx="30" cy="50" rx="4" ry="6" fill="#A8704A" />
      <ellipse cx="70" cy="50" rx="4" ry="6" fill="#A8704A" />
      <path d="M30 40 C32 24 68 24 70 40 C64 34 36 34 30 40 Z" fill="#2B1A12" />
      {/* kufi */}
      <path d="M31 36 C31 20 69 20 69 36 Z" fill="#FFF8EC" />
      <path d="M33 31 h34" stroke="#1F8A85" strokeWidth="2.4" />
      <path d="M38 26 l3 3 3 -3 3 3 3 -3 3 3 3 -3 3 3 3 -3" stroke="#F5B53F" strokeWidth="1.6" fill="none" />
      <circle cx="43" cy="49" r="2.8" fill="#2B2140" />
      <circle cx="57" cy="49" r="2.8" fill="#2B2140" />
      <circle cx="44" cy="48" r=".9" fill="#fff" />
      <circle cx="58" cy="48" r=".9" fill="#fff" />
      <path d="M43 58 q7 6 14 0" stroke="#5A2A1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="38" cy="55" r="3" fill="#E86A7F" opacity=".3" />
      <circle cx="62" cy="55" r="3" fill="#E86A7F" opacity=".3" />
    </svg>
  );
}

export function ParentAvatar({ size = 56 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Parent">
      <circle cx="50" cy="50" r="50" fill="#E9E1F7" />
      <path d="M16 100 C16 74 32 64 50 64 C68 64 84 74 84 100 Z" fill="#3B2E6E" />
      <path d="M26 54 C26 28 38 16 50 16 C62 16 74 28 74 54 C74 72 64 80 50 82 C36 80 26 72 26 54 Z" fill="#1F2A5C" />
      <ellipse cx="50" cy="50" rx="17" ry="19" fill="#C68E66" />
      <circle cx="44" cy="49" r="2.4" fill="#2B2140" />
      <circle cx="56" cy="49" r="2.4" fill="#2B2140" />
      <path d="M45 58 q5 4 10 0" stroke="#7A3B2E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = 44, light = false }: { size?: number; light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
        <rect width="64" height="64" rx="18" fill={light ? "#FFF8EC" : "#141B3D"} />
        <path d="M32 9l5.6 13.4L51 20.6 41.4 31.2 48.7 44 34.8 39.6 32 54 29.2 39.6 15.3 44l7.3-12.8L13 20.6l13.4 1.8z" fill="#F5B53F" />
        <circle cx="32" cy="31" r="7" fill={light ? "#FFF8EC" : "#141B3D"} />
        <path d="M34.5 26.5a5.5 5.5 0 1 0 0 9 4.4 4.4 0 1 1 0-9z" fill="#F5B53F" />
      </svg>
      <div className="leading-none">
        <div className={`font-display text-[1.7em] font-extrabold tracking-tight ${light ? "text-cream" : "text-night"}`}>Qafila</div>
        <div className={`text-[.62em] font-extrabold tracking-[.18em] uppercase ${light ? "text-saffron" : "text-teal"}`}>Journeys of light</div>
      </div>
    </div>
  );
}

/** Hanging lantern used for the streak (lit = gold glow). */
export function Lantern({ lit = true, size = 28, pulse = false }: { lit?: boolean; size?: number; pulse?: boolean }) {
  return (
    <svg viewBox="0 0 40 56" width={size} height={size * 1.4} aria-hidden="true" className={pulse ? "animate-bob" : ""}>
      <path d="M20 2 v6" stroke={lit ? "#C98F4E" : "#9A93A8"} strokeWidth="2.4" strokeLinecap="round" />
      {lit && <circle cx="20" cy="30" r="17" fill="#F5B53F" opacity=".28" />}
      <path d="M12 10 h16 l-2 5 h-12 z" fill={lit ? "#B4502A" : "#8D86A0"} />
      <path d="M11 15 h18 c3 6 3 22 0 28 h-18 c-3 -6 -3 -22 0 -28 z" fill={lit ? "#F5B53F" : "#C9C3D6"} />
      <path d="M15 15 c-1.5 8 -1.5 20 0 28 M25 15 c1.5 8 1.5 20 0 28 M20 15 v28" stroke={lit ? "#D08F1C" : "#ABA4BC"} strokeWidth="1.4" fill="none" />
      {lit && <path d="M20 23 c4 4.5 4 9 0 12 c-4 -3 -4 -7.5 0 -12 z" fill="#FFF8EC" />}
      <path d="M13 43 h14 l-2 5 h-10 z" fill={lit ? "#B4502A" : "#8D86A0"} />
      <path d="M17 48 h6 v4 h-6 z" fill={lit ? "#C98F4E" : "#9A93A8"} />
    </svg>
  );
}

/** 8-point star medallion used on journey nodes and badges. */
export function StarMedallion({ size = 88, fill = "#F5B53F", shade = "#D08F1C", children }: { size?: number; fill?: string; shade?: string; children?: ReactNode }) {
  const pts = (R: number, r: number) =>
    Array.from({ length: 16 }, (_, i) => {
      const a = (i * Math.PI) / 8 - Math.PI / 2;
      const q = i % 2 ? r : R;
      return `${(50 + q * Math.cos(a)).toFixed(1)},${(50 + q * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 108" width={size} height={size * 1.08} className="absolute inset-0" aria-hidden="true">
        <polygon points={pts(48, 38)} fill={shade} transform="translate(0 7)" />
        <polygon points={pts(48, 38)} fill={fill} />
        <polygon points={pts(41, 32)} fill="none" stroke="#FFF8EC" strokeOpacity=".55" strokeWidth="1.6" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}
