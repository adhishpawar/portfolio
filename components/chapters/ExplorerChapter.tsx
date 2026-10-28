import { Label } from "@/components/ui/Label";
import { SectionShell } from "@/components/ui/SectionShell";
import { Body } from "./Body";
import styles from "./Chapter.module.scss";
import { chapterNumber, titleId, type ChapterProps } from "./types";

export function ExplorerChapter({ chapter, explorer }: ChapterProps) {
  return (
    <SectionShell
      id={chapter.id}
      labelledBy={titleId(chapter)}
      level={2}
      title={chapter.title}
      eyebrow={<Label index={chapterNumber(chapter)}>{chapter.label}</Label>}
      aside={
        <ul className={styles.frames}>
          {explorer.frames.map((frame) => (
            <li key={frame.id}>
              <figure className={styles.frame}>
                <div
                  className={styles.frameArt}
                  role={frame.src ? undefined : "img"}
                  aria-label={frame.src ? undefined : frame.alt}
                >
                  {frame.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className={styles.frameImg} src={frame.src} alt={frame.alt} loading="lazy" />
                  ) : null}
                </div>
                <figcaption className={styles.frameCaption}>{frame.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      }
    >
      <Body paragraphs={chapter.body} />
    </SectionShell>
  );
}
