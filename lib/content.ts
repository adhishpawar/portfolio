import type { ZodType } from "zod";
import {
  ChapterSchema,
  ExplorerSchema,
  ProfileSchema,
  ProjectSchema,
  SkillsSchema,
  type Content,
} from "@/content/schema";
import profileJson from "@/content/profile.json";
import chaptersJson from "@/content/chapters.json";
import projectsJson from "@/content/projects.json";
import skillsJson from "@/content/skills.json";
import explorerJson from "@/content/explorer.json";

export class ContentError extends Error {
  constructor(
    public file: string,
    public path: string,
    detail: string,
  ) {
    super(`${file}: ${path ? `${path}: ` : ""}${detail}`);
    this.name = "ContentError";
  }
}

export type RawContent = Record<
  "profile" | "chapters" | "projects" | "skills" | "explorer",
  unknown
>;

const FILES: Record<keyof RawContent, string> = {
  profile: "profile.json",
  chapters: "chapters.json",
  projects: "projects.json",
  skills: "skills.json",
  explorer: "explorer.json",
};

export function loadRawContent(): RawContent {
  return {
    profile: profileJson,
    chapters: chaptersJson,
    projects: projectsJson,
    skills: skillsJson,
    explorer: explorerJson,
  };
}

function check<T>(key: keyof RawContent, schema: ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  const issue = result.error.issues[0];
  throw new ContentError(FILES[key], issue.path.join("."), issue.message);
}

export function parseContent(raw: RawContent): Content {
  const profile = check("profile", ProfileSchema, raw.profile);
  const chapters = check("chapters", ChapterSchema.array(), raw.chapters);
  const projects = check("projects", ProjectSchema.array(), raw.projects);
  const skills = check("skills", SkillsSchema, raw.skills);
  const explorer = check("explorer", ExplorerSchema, raw.explorer);

  chapters.forEach((chapter, i) => {
    if (chapter.index !== i || chapter.id !== `ch-0${i}`) {
      throw new ContentError(
        FILES.chapters,
        `${i}`,
        `chapter ${i} must have index ${i} and id "ch-0${i}"`,
      );
    }
  });

  const projectIds = new Set(projects.map((p) => p.id));
  for (const chapter of chapters) {
    for (const id of chapter.projectIds ?? []) {
      if (!projectIds.has(id)) {
        throw new ContentError(
          FILES.chapters,
          `${chapter.index}.projectIds`,
          `unknown project id "${id}"`,
        );
      }
    }
  }

  return { profile, chapters, projects, skills, explorer };
}

export function loadContent(): Content {
  return parseContent(loadRawContent());
}
