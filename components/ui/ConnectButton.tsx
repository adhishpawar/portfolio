"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import styles from "./Button.module.scss";

export function ConnectButton({ href, children }: { href: string; children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <m.a
      className={styles.button}
      href={href}
      whileHover={reduced ? undefined : { scale: 1.03 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
    >
      {children}
    </m.a>
  );
}
