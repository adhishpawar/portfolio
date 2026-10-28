import { describe, expect, it } from "vitest";
import { parseEmphasis } from "@/lib/emphasis";

describe("parseEmphasis", () => {
  it("splits a marked word out of the text", () => {
    expect(parseEmphasis("a *b* c")).toEqual([
      { text: "a ", em: false },
      { text: "b", em: true },
      { text: " c", em: false },
    ]);
  });

  it("handles several emphasised phrases", () => {
    expect(parseEmphasis("*one* and *two words*")).toEqual([
      { text: "one", em: true },
      { text: " and ", em: false },
      { text: "two words", em: true },
    ]);
  });

  it("keeps a lone asterisk literal", () => {
    expect(parseEmphasis("2 * 3")).toEqual([{ text: "2 * 3", em: false }]);
  });

  it("keeps an unclosed marker literal", () => {
    expect(parseEmphasis("*open")).toEqual([{ text: "*open", em: false }]);
  });

  it("returns nothing for an empty string", () => {
    expect(parseEmphasis("")).toEqual([]);
  });
});
