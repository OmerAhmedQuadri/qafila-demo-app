import { createContext, useContext } from "react";

/** Size and orientation of the app screen (the device frame in presenter mode, or the real viewport). */
export interface Orient {
  landscape: boolean;
  w: number;
  h: number;
}

export const OrientCtx = createContext<Orient>({ landscape: false, w: 390, h: 844 });
export const useOrient = () => useContext(OrientCtx);
