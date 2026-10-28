import type { Project } from "@/content/schema";
import styles from "./Chapter.module.scss";

export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <ul className={styles.projects}>
      {projects.map((p) => (
        <li key={p.id} className={styles.project}>
          <h3 className={styles.projectTitle}>{p.title}</h3>
          <p className={styles.projectMeta}>
            {p.kind === "personal" ? "Personal project" : "Professional work"} / {p.role}
          </p>
          <p className={styles.projectSummary}>{p.summary}</p>
          <p className={styles.projectStack}>{p.stack.join(" / ")}</p>
          {p.links.length > 0 ? (
            <ul className={styles.links}>
              {p.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
