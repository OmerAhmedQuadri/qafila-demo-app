import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "./state/store";
import { DeviceFrame, FloatingGuide, PresenterPanel } from "./components/Shell";
import { Toast } from "./components/ui";
import { OrientCtx, type Orient } from "./components/orient";
import { OverlayCtx } from "./components/overlay";
import { Profiles, Splash } from "./screens/Welcome";
import { BottomNav, Home, TopBar } from "./screens/Home";
import { Journey } from "./screens/Journey";
import { Dhikr } from "./screens/Dhikr";
import { Garden } from "./screens/Garden";
import { LessonPlayer } from "./screens/lesson/LessonPlayer";
import { ParentDashboard, ParentGate } from "./screens/Parent";
import { Studio } from "./screens/Studio";

function MainTabs() {
  const tab = useStore((s) => s.tab);
  return (
    <div className="flex h-full flex-col bg-sand land:flex-row">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {tab === "home" && <TopBar />}
        {tab !== "home" && <div className="h-12 shrink-0 land:h-6" />}
        <div className="relative flex-1 overflow-y-auto no-scrollbar" key={tab}>
          <motion.div className="min-h-full" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
            {tab === "home" && <Home />}
            {tab === "journey" && <Journey />}
            {tab === "dhikr" && <Dhikr />}
            {tab === "garden" && <Garden />}
          </motion.div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function Screens() {
  const screen = useStore((s) => s.screen);
  const ref = useRef<HTMLDivElement>(null);
  const [orient, setOrient] = useState<Orient>({ landscape: false, w: 390, h: 844 });
  const [overlay, setOverlay] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // offsetWidth/Height = layout size, unaffected by the device frame's scale transform
    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      setOrient((o) => (o.w === w && o.h === h ? o : { w, h, landscape: w >= 600 && w > h * 1.1 }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  let node: ReactNode;
  switch (screen) {
    case "splash": node = <Splash />; break;
    case "profiles": node = <Profiles />; break;
    case "lesson": node = <LessonPlayer />; break;
    case "parentGate": node = <ParentGate />; break;
    case "parent": node = <ParentDashboard />; break;
    case "studio": node = <Studio />; break;
    default: node = <MainTabs />;
  }
  return (
    <OrientCtx.Provider value={orient}>
      <OverlayCtx.Provider value={overlay}>
        <div ref={ref} data-orient={orient.landscape ? "landscape" : "portrait"} className="@container relative h-full w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={screen} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {node}
            </motion.div>
          </AnimatePresence>
          {/* pop-ups render here: on top of the whole screen, not inside scrolled content */}
          <div ref={setOverlay} className="pointer-events-none absolute inset-0 z-[65]" />
          <Toast />
        </div>
      </OverlayCtx.Provider>
    </OrientCtx.Provider>
  );
}

function usePresenterMode() {
  // Presenter mode (side panel + device frame) only on big screens with a mouse,
  // so a real tablet held in landscape still gets the full-screen app.
  const check = () =>
    window.innerWidth >= 1024 && window.innerHeight >= 560 && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const [on, setOn] = useState(check);
  useEffect(() => {
    const f = () => setOn(check());
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return on;
}

export default function App() {
  const presenter = usePresenterMode();
  if (presenter) {
    return (
      <div className="flex h-full bg-[radial-gradient(circle_at_60%_40%,#2A2560,#0E1330_70%)]">
        <PresenterPanel />
        <main className="min-w-0 flex-1">
          <DeviceFrame>
            <Screens />
          </DeviceFrame>
        </main>
      </div>
    );
  }
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-cream">
      <Screens />
      <FloatingGuide />
    </div>
  );
}
