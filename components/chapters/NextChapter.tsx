import { Label } from "@/components/ui/Label";
import { SectionShell } from "@/components/ui/SectionShell";
import { Body } from "./Body";
import { chapterNumber, titleId, type ChapterProps } from "./types";

export function NextChapter({ chapter }: ChapterProps) {
  return (
    <SectionShell
      id={chapter.id}
      labelledBy={titleId(chapter)}
      level={2}
      title={chapter.title}
      eyebrow={<Label index={chapterNumber(chapter)}>{chapter.label}</Label>}
    >
      <Body paragraphs={chapter.body} />
    </SectionShell>
  );
}
