import { readFileSync } from "node:fs";
import path from "node:path";
import type { ZodType } from "zod";
import {
  ChapterSchema,
  ExplorerSchema,
  ProfileSchema,
  ProjectSchema,
  SkillsSchema,
  type Content,
} from "@/content/schema";

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

export function loadRawContent(dir = path.join(process.cwd(), "content")): RawContent {
  const read = (file: string) => JSON.parse(readFileSync(path.join(dir, file), "utf8"));
  return {
    profile: read(FILES.profile),
    chapters: read(FILES.chapters),
    projects: read(FILES.projects),
    skills: read(FILES.skills),
    explorer: read(FILES.explorer),
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
