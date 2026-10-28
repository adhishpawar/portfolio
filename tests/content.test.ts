import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ContentError, loadContent, loadRawContent, parseContent } from "@/lib/content";

const FORBIDDEN = /open to work|open to opportunities|hire me/i;

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("loadContent", () => {
  it("returns eight chapters indexed 0..7 in the spec's order", () => {
    const { chapters } = loadContent();
    expect(chapters.map((c) => c.index)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(chapters.map((c) => c.kind)).toEqual([
      "boot",
      "origin",
      "foundations",
      "production",
      "flagship",
      "next",
      "explorer",
      "connect",
    ]);
    expect(chapters.map((c) => c.id)).toEqual(
      [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `ch-0${i}`),
    );
  });

  it('states the CGPA as "9.38" and never mentions "9.93" in any content file', () => {
    expect(loadContent().profile.education.cgpa).toBe("9.38");
    for (const file of readdirSync("content").filter((f) => f.endsWith(".json"))) {
      expect(readFileSync(`content/${file}`, "utf8"), file).not.toContain("9.93");
    }
  });

  it("never says open to work, open to opportunities or hire me", () => {
    for (const text of strings(loadContent())) {
      expect(text).not.toMatch(FORBIDDEN);
    }
  });

  it("gives every project a non-empty source and a kind of client or personal", () => {
    const { projects } = loadContent();
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(p.source.trim().length, p.id).toBeGreaterThan(0);
      expect(["client", "personal"]).toContain(p.kind);
    }
  });

  it("only references projects that exist", () => {
    const { chapters, projects } = loadContent();
    const ids = new Set(projects.map((p) => p.id));
    for (const c of chapters) {
      for (const id of c.projectIds ?? []) expect(ids.has(id), `${c.id} -> ${id}`).toBe(true);
    }
  });

  it("uses the headline and exact FifthSense copy from the spec", () => {
    const { profile, chapters } = loadContent();
    expect(profile.headline).toBe(
      "Associate Software Engineer | Java & Python | Agentic AI & GenAI | Core ML, Experimentation & Production Pipelines | Building AI Products from Scratch to Scale",
    );
    const flagship = chapters[4];
    expect(flagship.title).toBe("Teaching a system to *understand* people.");
    expect(flagship.body).toContain("First pilot: Royal Orchid Hotels, Bangalore.");
    expect(flagship.quote?.text).toBe("That's the only metric that really counts.");
  });
});

describe("parseContent errors", () => {
  it("names the file and field when a project has no source", () => {
    const raw = structuredClone(loadRawContent());
    delete (raw.projects as Record<string, unknown>[])[0].source;
    try {
      parseContent(raw);
      throw new Error("expected ContentError");
    } catch (e) {
      expect(e).toBeInstanceOf(ContentError);
      const err = e as ContentError;
      expect(err.file).toBe("projects.json");
      expect(err.path).toContain("source");
      expect(err.message).toContain("projects.json");
    }
  });

  it("names the file when a chapter references an unknown project", () => {
    const raw = structuredClone(loadRawContent());
    (raw.chapters as Record<string, unknown>[])[2].projectIds = ["does-not-exist"];
    expect(() => parseContent(raw)).toThrowError(/chapters\.json[\s\S]*does-not-exist/);
  });

  it("accepts a 300-character title with no spaces", () => {
    const raw = structuredClone(loadRawContent());
    (raw.chapters as Record<string, unknown>[])[1].title = "x".repeat(300);
    expect(parseContent(raw).chapters[1].title).toHaveLength(300);
  });
});
