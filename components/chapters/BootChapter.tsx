import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { SectionShell } from "@/components/ui/SectionShell";
import { Body } from "./Body";
import styles from "./Chapter.module.scss";
import { chapterNumber, titleId, type ChapterProps } from "./types";

export function BootChapter({ chapter }: ChapterProps) {
  return (
    <SectionShell
      id={chapter.id}
      labelledBy={titleId(chapter)}
      level={1}
      title={chapter.title}
      eyebrow={<Label index={chapterNumber(chapter)}>{chapter.label}</Label>}
      aside={<div data-slot="orb" className={styles.slot} />}
    >
      <Body paragraphs={chapter.body} />
      <div className={styles.actions}>
        <Button href="#ch-07">Let&apos;s connect</Button>
      </div>
    </SectionShell>
  );
}
