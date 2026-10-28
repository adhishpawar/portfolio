import type { Chapter, Explorer, Profile, Project } from "@/content/schema";

export interface ChapterProps {
  chapter: Chapter;
  projects: Project[];
  explorer: Explorer;
  profile: Profile;
}

export const chapterNumber = (chapter: Chapter): string => String(chapter.index).padStart(2, "0");
export const titleId = (chapter: Chapter): string => `title-${chapter.id}`;
