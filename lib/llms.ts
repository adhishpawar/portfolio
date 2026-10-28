import type { Content } from "@/content/schema";

const plain = (text: string) => text.replace(/\*([^*]+)\*/g, "$1");

export function buildLlmsTxt(content: Content, siteUrl: string): string {
  const { profile, chapters, projects, skills } = content;

  const chapterLines = chapters.map((c) => `- ${c.label}: ${plain(c.title)}`);
  const projectLines = projects.map((p) => {
    const link = p.links[0];
    const name = link ? `[${p.title}](${link.href})` : p.title;
    return `- ${name}: ${p.summary}`;
  });
  const skillLines = skills.groups.map((g) => `- ${g.name}: ${g.items.join(", ")}`);

  return [
    `# ${profile.name}`,
    "",
    `> ${profile.name}, ${profile.role.title} at ${profile.role.company}, ${profile.location}. ${profile.headline}`,
    "",
    "## About",
    "",
    profile.aspirations,
    "",
    "## Current role",
    "",
    `${profile.role.title}, ${profile.role.company}, since ${profile.role.since}.`,
    "",
    "## Chapters",
    "",
    ...chapterLines,
    "",
    "## Projects",
    "",
    ...projectLines,
    "",
    "## Skills",
    "",
    ...skillLines,
    "",
    "## Contact",
    "",
    `- Site: ${siteUrl}`,
    `- LinkedIn: ${profile.links.linkedin}`,
    `- GitHub: ${profile.links.github}`,
    `- Email: ${profile.links.email}`,
    "",
  ].join("\n");
}
