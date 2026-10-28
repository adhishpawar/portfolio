import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const tokens = readFileSync("styles/_tokens.scss", "utf8");

describe("design tokens", () => {
  it.each([
    ["--void", "#0D0D0D"],
    ["--surface", "#101010"],
    ["--navy", "#132644"],
    ["--signal", "#F4F4F4"],
    ["--dim", "#9F9F9F"],
    ["--faint", "#828282"],
    ["--accent", "#2F5BFF"],
    ["--accent-text", "#7C97FF"],
  ])("defines %s as %s", (name, value) => {
    expect(tokens).toMatch(new RegExp(String.raw`${name}:\s*${value};`, "i"));
  });

  it("does not define the same token twice", () => {
    const names = [...tokens.matchAll(/^\s*(--[a-z0-9-]+):/gim)].map((m) => m[1]);
    expect(new Set(names).size).toBe(names.length);
  });
});
