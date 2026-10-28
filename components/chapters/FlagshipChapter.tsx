import { HandLineArt } from "@/components/diagrams/HandLineArt";
import { PipelineDiagram } from "@/components/diagrams/PipelineDiagram";
import { FlagshipEffects } from "@/components/motion/FlagshipEffects";
import { Label } from "@/components/ui/Label";
import { SectionShell } from "@/components/ui/SectionShell";
import { FifthSenseGlow } from "@/components/webgl/FifthSenseGlow";
import { Body } from "./Body";
import styles from "./Chapter.module.scss";
import { chapterNumber, titleId, type ChapterProps } from "./types";

export function FlagshipChapter({ chapter, projects }: ChapterProps) {
  const project = projects.find((p) => p.diagram);
  return (
    <SectionShell
      id={chapter.id}
      labelledBy={titleId(chapter)}
      level={2}
      title={chapter.title}
      eyebrow={<Label index={chapterNumber(chapter)}>{chapter.label}</Label>}
      aside={
        <div className={styles.flagshipVisual}>
          <FifthSenseGlow />
          <div className={styles.flagshipArt}>
            <HandLineArt />
            {project?.diagram ? (
              <PipelineDiagram nodes={project.diagram.nodes} title={`${project.title} pipeline`} />
            ) : null}
          </div>
        </div>
      }
    >
      <FlagshipEffects targetId={chapter.id} />
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
