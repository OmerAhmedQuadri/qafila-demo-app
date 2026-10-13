import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 24) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true });

export const IconHome = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" /></svg>);
export const IconMap = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></svg>);
export const IconBeads = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><circle cx="12" cy="10" r="6.5" strokeDasharray="0.1 3.4" strokeWidth="3.4" /><path d="M12 16.5v3.5M10 22h4" /></svg>);
export const IconSprout = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M12 21v-9" /><path d="M12 13c-5 0-7-4-7-7 5 0 7 3 7 7zM12 15c4 0 6-3 6-6-4 0-6 2-6 6z" /><path d="M7 21h10" /></svg>);
export const IconLock = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>);
export const IconCheck = ({ size, ...p }: P) => (<svg {...base(size)} strokeWidth={3} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>);
export const IconX = ({ size, ...p }: P) => (<svg {...base(size)} strokeWidth={2.8} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const IconArrowRight = ({ size, ...p }: P) => (<svg {...base(size)} strokeWidth={2.8} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const IconBack = ({ size, ...p }: P) => (<svg {...base(size)} strokeWidth={2.8} {...p}><path d="M15 5 8 12l7 7" /></svg>);
export const IconSpeaker = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></svg>);
export const IconMute = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="m17 9 4 6M21 9l-4 6" /></svg>);
export const IconBook = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z" /></svg>);
export const IconHeart = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>);
export const IconSparkle = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></svg>);
export const IconGear = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" /></svg>);
export const IconPlay = ({ size, ...p }: P) => (<svg {...base(size)} fill="currentColor" stroke="none" {...p}><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5z" /></svg>);
export const IconShield = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z" /><path d="m9 12 2 2 4-4" /></svg>);
export const IconClock = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>);
export const IconChat = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-5 4V6a1 1 0 0 1 1-1z" /></svg>);
export const IconRefresh = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M20 11a8 8 0 0 0-14.6-4.4L4 8M4 4v4h4M4 13a8 8 0 0 0 14.6 4.4L20 16M20 20v-4h-4" /></svg>);
export const IconStudio = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8M12 17v4M10 9l4 2-4 2z" /></svg>);
export const IconStar = ({ size, ...p }: P) => (<svg {...base(size)} fill="currentColor" stroke="none" {...p}><path d="m12 2.8 2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 16.7l-5.4 2.9 1-6.1-4.4-4.3 6.1-.8z" /></svg>);
export const IconRotate = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><rect x="4" y="7" width="16" height="10" rx="2" /><path d="M8 3.5A8.5 8.5 0 0 1 19.5 6M16 20.5A8.5 8.5 0 0 1 4.5 18" /><path d="M19.5 2.5V6H16M4.5 21.5V18H8" /></svg>);
