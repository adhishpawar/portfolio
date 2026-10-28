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

export const ChapterSchema = z.strictObject({
  id: text,
  index: z.number().int().min(0),
  kind: ChapterKind,
  label: text,
  title: text,
  body: z.array(text),
  stations: z.array(z.strictObject({ tag: text, caption: text })).optional(),
  projectIds: z.array(text).optional(),
  quote: z.strictObject({ text, attribution: text, source: text }).optional(),
});
export type Chapter = z.infer<typeof ChapterSchema>;

export const ProjectSchema = z.strictObject({
  id: text,
  title: text,
  role: text,
  kind: z.enum(["client", "personal"]),
  summary: text,
  stack: z.array(text),
  links: z.array(z.strictObject({ label: text, href: z.string().url() })),
  diagram: z
    .strictObject({ nodes: z.array(z.strictObject({ id: text, label: text, detail: text })) })
    .optional(),
  source: text,
});
export type Project = z.infer<typeof ProjectSchema>;

export const ProfileSchema = z.strictObject({
  name: text,
  headline: text,
  role: z.strictObject({ title: text, company: text, since: text }),
  location: text,
  aspirations: text,
  education: z.strictObject({ school: text, degree: text, years: text, cgpa: text }),
  links: z.strictObject({ linkedin: z.string().url(), github: z.string().url(), email: text }),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const SkillsSchema = z.strictObject({
  groups: z.array(z.strictObject({ name: text, items: z.array(text) })),
});
export type Skills = z.infer<typeof SkillsSchema>;

export const ExplorerSchema = z.strictObject({
  frames: z.array(z.strictObject({ id: text, caption: text, alt: text, src: text.optional() })),
});
export type Explorer = z.infer<typeof ExplorerSchema>;

export interface Content {
  profile: Profile;
  chapters: Chapter[];
  projects: Project[];
  skills: Skills;
  explorer: Explorer;
}
