import { ConnectButton } from "@/components/ui/ConnectButton";
import { Label } from "@/components/ui/Label";
import { SectionShell } from "@/components/ui/SectionShell";
import { Body } from "./Body";
import styles from "./Chapter.module.scss";
import { chapterNumber, titleId, type ChapterProps } from "./types";

export function ConnectChapter({ chapter, profile }: ChapterProps) {
  return (
    <SectionShell
      id={chapter.id}
      labelledBy={titleId(chapter)}
      level={2}
      title={chapter.title}
      eyebrow={<Label index={chapterNumber(chapter)}>{chapter.label}</Label>}
    >
      <Body paragraphs={chapter.body} />
      <div className={styles.actions}>
        <ConnectButton href={profile.links.linkedin}>Let&apos;s connect</ConnectButton>
      </div>
      <ul className={styles.links}>
        <li>
          <a href={profile.links.linkedin}>LinkedIn</a>
        </li>
        <li>
          <a href={profile.links.github}>GitHub</a>
        </li>
        <li>
          <a href={`mailto:${profile.links.email}`}>{profile.links.email}</a>
        </li>
      </ul>
    </SectionShell>
  );
}
