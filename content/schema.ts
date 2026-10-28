import { z } from "zod";

export const ChapterKind = z.enum([
  "boot",
  "origin",
  "foundations",
  "production",
  "flagship",
  "next",
  "explorer",
  "connect",
]);
export type ChapterKind = z.infer<typeof ChapterKind>;

const text = z.string().min(1);

export const ChapterSchema = z.object({
  id: text,
  index: z.number().int().min(0),
  kind: ChapterKind,
  label: text,
  title: text,
  body: z.array(text),
  stations: z.array(z.object({ tag: text, caption: text })).optional(),
  projectIds: z.array(text).optional(),
  quote: z.object({ text, attribution: text }).optional(),
});
export type Chapter = z.infer<typeof ChapterSchema>;

export const ProjectSchema = z.object({
  id: text,
  title: text,
  role: text,
  kind: z.enum(["client", "personal"]),
  summary: text,
  stack: z.array(text),
  links: z.array(z.object({ label: text, href: z.string().url() })),
  diagram: z
    .object({ nodes: z.array(z.object({ id: text, label: text, detail: text })) })
    .optional(),
  source: text,
});
export type Project = z.infer<typeof ProjectSchema>;

export const ProfileSchema = z.object({
  name: text,
  headline: text,
  role: z.object({ title: text, company: text, since: text }),
  location: text,
  aspirations: text,
  education: z.object({ school: text, degree: text, years: text, cgpa: text }),
  links: z.object({ linkedin: z.string().url(), github: z.string().url(), email: text }),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const SkillsSchema = z.object({
  groups: z.array(z.object({ name: text, items: z.array(text) })),
});
export type Skills = z.infer<typeof SkillsSchema>;

export const ExplorerSchema = z.object({
  frames: z.array(z.object({ id: text, caption: text, alt: text, src: text.optional() })),
});
export type Explorer = z.infer<typeof ExplorerSchema>;

export interface Content {
  profile: Profile;
  chapters: Chapter[];
  projects: Project[];
  skills: Skills;
  explorer: Explorer;
}
