import { createContext } from "react";

/** Screen-level layer that pop-ups render into, so they sit on top of the screen, not inside scrolled content. */
export const OverlayCtx = createContext<HTMLElement | null>(null);
