import { Boot } from "@/components/motion/Boot";
import { ConnectButton } from "@/components/ui/ConnectButton";
import { bootLines } from "@/lib/boot";
import { Label } from "@/components/ui/Label";
import { SectionShell } from "@/components/ui/SectionShell";
import { Body } from "./Body";
import styles from "./Chapter.module.scss";
import { chapterNumber, titleId, type ChapterProps } from "./types";

export function BootChapter({ chapter, profile }: ChapterProps) {
  return (
    <SectionShell
      id={chapter.id}
      labelledBy={titleId(chapter)}
      level={1}
      title={chapter.title}
      eyebrow={<Label index={chapterNumber(chapter)}>{chapter.label}</Label>}
      aside={<div data-slot="orb" className={styles.slot} />}
    >
      <Boot lines={bootLines(profile, chapter)} />
      <Body paragraphs={chapter.body} />
      <div className={styles.actions}>
        <ConnectButton href="#ch-07">Let&apos;s connect</ConnectButton>
      </div>
    </SectionShell>
  );
}
