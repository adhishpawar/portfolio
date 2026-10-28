import { describe, expect, it } from "vitest";
import { loadContent } from "@/lib/content";
import { buildLlmsTxt } from "@/lib/llms";

const SITE = "https://adhish.example";
const content = loadContent();
const txt = buildLlmsTxt(content, SITE);

function section(name: string): string[] {
  const lines = txt.split("\n");
  const start = lines.indexOf(`## ${name}`);
  expect(start, `missing "## ${name}"`).toBeGreaterThanOrEqual(0);
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => l.startsWith("## "));
  return (end === -1 ? rest : rest.slice(0, end)).filter((l) => l.trim() !== "");
}

describe("buildLlmsTxt", () => {
  it('starts with "# Adhish Pawar" followed by a "> " summary line', () => {
    const lines = txt.split("\n");
    expect(lines[0]).toBe("# Adhish Pawar");
    expect(lines.slice(1, 4).some((l) => l.startsWith("> "))).toBe(true);
  });

  it("lists all eight chapters under Chapters", () => {
    const lines = section("Chapters");
    expect(lines).toHaveLength(8);
    expect(lines.every((l) => l.startsWith("- "))).toBe(true);
    expect(lines[4]).toContain("Teaching a system to understand people.");
    expect(txt).not.toContain("*understand*");
  });

  it("lists every project under Projects, with its link when it has one", () => {
    const lines = section("Projects");
    expect(lines).toHaveLength(content.projects.length);
    for (const project of content.projects) {
      const line = lines.find((l) => l.includes(project.title));
      expect(line, project.title).toBeDefined();
      for (const link of project.links) expect(line).toContain(link.href);
    }
  });

  it("gives the current role and contact details", () => {
    expect(txt).toContain("Associate Software Engineer");
    expect(txt).toContain("CoReCo Technologies Private Limited");
    expect(txt).toContain(content.profile.links.linkedin);
    expect(txt).toContain(SITE);
  });

  it("is deterministic and never says open to work", () => {
    expect(buildLlmsTxt(content, SITE)).toBe(txt);
    expect(txt).not.toMatch(/open to work|open to opportunities|hire me/i);
  });
});
