import type { ReactNode } from "react";
import styles from "./Label.module.scss";

export function Label({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <p className={styles.label}>
      {index ? <span className={styles.index}>[{index}]</span> : null}
      {children}
    </p>
  );
}
