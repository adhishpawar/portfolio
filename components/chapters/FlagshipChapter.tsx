import { Label } from "@/components/ui/Label";
import { SectionShell } from "@/components/ui/SectionShell";
import { Body } from "./Body";
import styles from "./Chapter.module.scss";
import { chapterNumber, titleId, type ChapterProps } from "./types";

export function FlagshipChapter({ chapter }: ChapterProps) {
  return (
    <SectionShell
      id={chapter.id}
      labelledBy={titleId(chapter)}
      level={2}
      title={chapter.title}
      eyebrow={<Label index={chapterNumber(chapter)}>{chapter.label}</Label>}
      aside={<div data-slot="pipeline" className={styles.slot} />}
    >
      <Body paragraphs={chapter.body} />
      {chapter.quote ? (
        <blockquote className={styles.quote}>
          <p className={styles.quoteText}>{chapter.quote.text}</p>
          <footer className={styles.quoteBy}>{chapter.quote.attribution}</footer>
        </blockquote>
      ) : null}
    </SectionShell>
  );
}
