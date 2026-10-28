"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

export const loadMotionFeatures = () => import("./features").then((module) => module.default);

export function MotionRoot({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadMotionFeatures}>{children}</LazyMotion>;
}
