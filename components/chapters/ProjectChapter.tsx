import { Label } from "@/components/ui/Label";
import { SectionShell } from "@/components/ui/SectionShell";
import { Body } from "./Body";
import { ProjectList } from "./ProjectList";
import { chapterNumber, titleId, type ChapterProps } from "./types";

// Origin and Foundations share one layout: copy plus the projects they reference.
export function ProjectChapter({ chapter, projects }: ChapterProps) {
  return (
    <SectionShell
      id={chapter.id}
      labelledBy={titleId(chapter)}
      level={2}
      title={chapter.title}
      eyebrow={<Label index={chapterNumber(chapter)}>{chapter.label}</Label>}
    >
      <Body paragraphs={chapter.body} />
      <ProjectList projects={projects} />
    </SectionShell>
  );
}
