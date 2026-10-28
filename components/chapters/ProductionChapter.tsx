import { Label } from "@/components/ui/Label";
import { SectionShell } from "@/components/ui/SectionShell";
import { Body } from "./Body";
import styles from "./Chapter.module.scss";
import { chapterNumber, titleId, type ChapterProps } from "./types";

export function ProductionChapter({ chapter }: ChapterProps) {
  return (
    <SectionShell
      id={chapter.id}
      labelledBy={titleId(chapter)}
      level={2}
      title={chapter.title}
      eyebrow={<Label index={chapterNumber(chapter)}>{chapter.label}</Label>}
    >
      <Body paragraphs={chapter.body} />
      {chapter.stations && chapter.stations.length > 0 ? (
        <ol className={styles.stations}>
          {chapter.stations.map((s) => (
            <li key={s.tag} className={styles.station}>
              <span className={styles.stationTag}>{s.tag}</span>
              <span>{s.caption}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </SectionShell>
  );
}
