import type { Chapter, ChapterKind, Explorer, Profile, Project } from "@/content/schema";
import type { ComponentType } from "react";
import { BootChapter } from "./BootChapter";
import { ConnectChapter } from "./ConnectChapter";
import { ExplorerChapter } from "./ExplorerChapter";
import { FlagshipChapter } from "./FlagshipChapter";
import { NextChapter } from "./NextChapter";
import { ProductionChapter } from "./ProductionChapter";
import { ProjectChapter } from "./ProjectChapter";
import type { ChapterProps } from "./types";

const BY_KIND: Record<ChapterKind, ComponentType<ChapterProps>> = {
  boot: BootChapter,
  origin: ProjectChapter,
  foundations: ProjectChapter,
  production: ProductionChapter,
  flagship: FlagshipChapter,
  next: NextChapter,
  explorer: ExplorerChapter,
  connect: ConnectChapter,
};

interface ChapterRendererProps {
  chapter: Chapter;
  projects: Project[];
  explorer: Explorer;
  profile: Profile;
}

export function ChapterRenderer({ chapter, projects, explorer, profile }: ChapterRendererProps) {
  const Component = BY_KIND[chapter.kind];
  const referenced = (chapter.projectIds ?? [])
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is Project => p !== undefined);
  return <Component chapter={chapter} projects={referenced} explorer={explorer} profile={profile} />;
}
