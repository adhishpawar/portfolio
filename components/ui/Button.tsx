import type { ReactNode } from "react";
import styles from "./Button.module.scss";

export function Button({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className={styles.button} href={href}>
      {children}
    </a>
  );
}
