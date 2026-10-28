import type { ReactNode } from "react";
import { Emphasis } from "./Emphasis";
import styles from "./SectionShell.module.scss";

interface SectionShellProps {
  id: string;
  labelledBy: string;
  level: 1 | 2;
  title: string;
  children?: ReactNode;
}

export function SectionShell({ id, labelledBy, level, title, children }: SectionShellProps) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <section id={id} aria-labelledby={labelledBy} className={styles.section}>
      <Heading id={labelledBy} className={`${styles.heading} ${level === 1 ? styles.h1 : ""}`}>
        <Emphasis text={title} />
      </Heading>
      {children}
    </section>
  );
}
