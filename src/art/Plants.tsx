import type { PlantKind } from "../state/store";

/** Garden plants. Each grows from a real action (lesson, dhikr, good deed), never from points. */
export function PlantArt({ kind, size = 80 }: { kind: PlantKind; size?: number }) {
  switch (kind) {
    case "palm":
      return (
        <svg viewBox="0 0 100 120" width={size} height={size * 1.2} aria-hidden="true">
          <path d="M48 118 C46 90 50 70 54 46" stroke="#8C5A2B" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M47 112 l8 -2 M48 100 l8 -2 M49 88 l8 -2 M50 76 l8 -2 M52 64 l7 -2" stroke="#6E4520" strokeWidth="2.5" strokeLinecap="round" />
          <g fill="#3E8E5A">
            <path d="M54 46 C40 30 20 32 8 44 C26 40 40 42 54 48z" />
            <path d="M54 46 C70 28 90 32 96 46 C80 40 66 42 54 48z" />
            <path d="M54 44 C50 26 56 12 68 6 C62 20 60 32 56 46z" />
            <path d="M54 44 C44 30 30 20 18 22 C32 28 44 38 52 48z" fill="#4FA56C" />
            <path d="M55 45 C66 36 82 24 92 26 C80 34 68 42 56 48z" fill="#4FA56C" />
          </g>
          <circle cx="50" cy="50" r="3.5" fill="#B4502A" />
          <circle cx="57" cy="51" r="3.5" fill="#B4502A" />
          <circle cx="53" cy="55" r="3.5" fill="#C9632F" />
        </svg>
      );
    case "olive":
      return (
        <svg viewBox="0 0 100 120" width={size} height={size * 1.2} aria-hidden="true">
          <path d="M50 118 C48 100 44 88 50 70 M50 86 C58 80 62 74 64 66" stroke="#7A5230" strokeWidth="7" fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="48" rx="36" ry="28" fill="#6E9B55" />
          <ellipse cx="36" cy="44" rx="18" ry="14" fill="#86B06A" />
          <ellipse cx="64" cy="40" rx="16" ry="12" fill="#86B06A" />
          {[[34, 54], [48, 36], [62, 52], [72, 44], [42, 60], [56, 60]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="3" ry="4" fill="#3B2E6E" />
          ))}
        </svg>
      );
    case "rose":
      return (
        <svg viewBox="0 0 100 120" width={size} height={size * 1.2} aria-hidden="true">
          <path d="M50 118 V60" stroke="#3E8E5A" strokeWidth="5" strokeLinecap="round" />
          <path d="M50 92 C38 92 30 84 28 76 C40 76 48 82 50 92z M50 80 C62 80 70 72 72 64 C60 64 52 70 50 80z" fill="#4FA56C" />
          <circle cx="50" cy="44" r="20" fill="#E86A7F" />
          <path d="M50 30 C40 32 38 44 46 50 C54 56 64 48 60 40 C57 34 50 36 50 42" stroke="#B8445A" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="44" r="20" fill="none" stroke="#FFB3BF" strokeWidth="2" opacity=".6" />
        </svg>
      );
    case "lily":
      return (
        <svg viewBox="0 0 100 120" width={size} height={size * 1.2} aria-hidden="true">
          <path d="M50 118 V62" stroke="#3E8E5A" strokeWidth="5" strokeLinecap="round" />
          <path d="M50 100 C36 98 28 88 28 80 C42 82 48 90 50 100z" fill="#4FA56C" />
          <g fill="#FFF8EC" stroke="#E2B77A" strokeWidth="1.5">
            <path d="M50 60 C38 52 34 36 40 26 C48 34 52 46 50 60z" />
            <path d="M50 60 C62 52 66 36 60 26 C52 34 48 46 50 60z" />
            <path d="M50 60 C44 46 46 30 50 20 C54 30 56 46 50 60z" />
          </g>
          <circle cx="50" cy="52" r="4" fill="#F5B53F" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 120" width={size} height={size * 1.2} aria-hidden="true">
          <path d="M50 118 V64" stroke="#3E8E5A" strokeWidth="5" strokeLinecap="round" />
          <path d="M50 96 C62 94 70 86 72 78 C58 80 52 88 50 96z" fill="#4FA56C" />
          {[0, 60, 120, 180, 240, 300].map((r) => (
            <ellipse key={r} cx="50" cy="38" rx="8" ry="15" fill="#F5B53F" transform={`rotate(${r} 50 52)`} />
          ))}
          <circle cx="50" cy="52" r="9" fill="#D9693B" />
        </svg>
      );
  }
}
