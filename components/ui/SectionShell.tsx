import type { ReactNode } from "react";
import { Emphasis } from "./Emphasis";
import styles from "./SectionShell.module.scss";

interface SectionShellProps {
  id: string;
  labelledBy: string;
  level: 1 | 2;
  title: string;
  eyebrow?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
}

export function SectionShell({
  id,
  labelledBy,
  level,
  title,
  eyebrow,
  aside,
  children,
}: SectionShellProps) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${styles.section} ${aside ? styles.hasAside : ""}`}
    >
      <div className={styles.content}>
        {eyebrow}
        <Heading id={labelledBy} className={`${styles.heading} ${level === 1 ? styles.h1 : ""}`}>
          <Emphasis text={title} />
        </Heading>
        {children}
      </div>
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </section>
  );
}
