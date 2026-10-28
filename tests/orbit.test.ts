import { describe, expect, it } from "vitest";
import { computeOrbitSegments } from "@/lib/orbit";

const IDS = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `ch-0${i}`);

describe("computeOrbitSegments", () => {
  it("covers [0, 1] with contiguous segments in order", () => {
    const segments = computeOrbitSegments(IDS);
    expect(segments.map((s) => s.id)).toEqual(IDS);
    expect(segments[0].start).toBe(0);
    expect(segments.at(-1)!.end).toBeCloseTo(1, 9);
    for (let i = 1; i < segments.length; i++) {
      expect(segments[i].start).toBeCloseTo(segments[i - 1].end, 9);
    }
    const total = segments.reduce((sum, s) => sum + (s.end - s.start), 0);
    expect(total).toBeCloseTo(1, 9);
  });

  it("gives equal spans by default", () => {
    const spans = computeOrbitSegments(IDS).map((s) => s.end - s.start);
    for (const span of spans) expect(span).toBeCloseTo(1 / 8, 9);
  });

  it("gives a weighted chapter proportionally more room", () => {
    const segments = computeOrbitSegments(IDS, { "ch-04": 2 });
    const span = (id: string) => {
      const s = segments.find((x) => x.id === id)!;
      return s.end - s.start;
    };
    expect(span("ch-04")).toBeCloseTo(2 * span("ch-03"), 9);
    expect(segments.at(-1)!.end).toBeCloseTo(1, 9);
  });

  it("returns an empty list for no chapters", () => {
    expect(computeOrbitSegments([])).toEqual([]);
  });

  it("ignores non-positive weights rather than collapsing a chapter", () => {
    const segments = computeOrbitSegments(["a", "b"], { a: 0, b: -3 });
    expect(segments[0].end - segments[0].start).toBeCloseTo(0.5, 9);
  });
});
