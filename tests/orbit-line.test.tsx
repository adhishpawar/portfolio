import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "./helpers/matchMedia";
import { OrbitLine } from "@/components/motion/OrbitLine";

const IDS = ["ch-00", "ch-01", "ch-02"];

const { loads, timeline, gsap } = vi.hoisted(() => {
  const loads = { gsap: 0, scrollTrigger: 0 };
  const timeline = {
    to: vi.fn(),
    addLabel: vi.fn(),
    kill: vi.fn(),
    scrollTrigger: { kill: vi.fn() },
  };
  timeline.to.mockReturnValue(timeline);
  timeline.addLabel.mockReturnValue(timeline);
  const gsap = {
    registerPlugin: vi.fn(),
    timeline: vi.fn((config?: { scrollTrigger?: { scrub?: unknown } }) => {
      void config;
      return timeline;
    }),
  };
  return { loads, timeline, gsap };
});

vi.mock("gsap", () => {
  loads.gsap++;
  return { gsap };
});
vi.mock("gsap/ScrollTrigger", () => {
  loads.scrollTrigger++;
  return { ScrollTrigger: { name: "ScrollTrigger" } };
});

const engage = async () => {
  window.dispatchEvent(new Event("scroll"));
  await vi.advanceTimersByTimeAsync(0);
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => vi.useRealTimers());

describe("OrbitLine", () => {
  it("is fully drawn and never loads GSAP under reduced motion", async () => {
    mockMatchMedia(true);
    const { container } = render(<OrbitLine chapterIds={IDS} />);
    await engage();
    expect(container.querySelector("path")).toHaveAttribute("stroke-dashoffset", "0");
    expect(loads.gsap).toBe(0);
    expect(loads.scrollTrigger).toBe(0);
  });

  it("is decorative: aria-hidden, and its stylesheet sets pointer-events: none", () => {
    mockMatchMedia(true);
    const { container } = render(<OrbitLine chapterIds={IDS} />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(readFileSync("components/motion/OrbitLine.module.scss", "utf8")).toContain(
      "pointer-events: none",
    );
  });

  it("builds one scrubbed timeline with a labelled tween per chapter after idle", async () => {
    mockMatchMedia(false);
    render(<OrbitLine chapterIds={IDS} weights={{ "ch-01": 2 }} />);
    expect(gsap.timeline).not.toHaveBeenCalled();
    await engage();
    expect(gsap.registerPlugin).toHaveBeenCalledWith({ name: "ScrollTrigger" });
    expect(gsap.timeline).toHaveBeenCalledTimes(1);
    const config = gsap.timeline.mock.calls[0][0];
    expect(config?.scrollTrigger?.scrub).toBeTruthy();
    expect(timeline.addLabel.mock.calls.map((c) => c[0])).toEqual(IDS);
    expect(timeline.to).toHaveBeenCalledTimes(IDS.length);
    // the last tween ends fully drawn: dashoffset 0
    expect(timeline.to.mock.calls.at(-1)![1]).toMatchObject({ strokeDashoffset: 0 });
  });

  it("works in path-length units of 1000 so GSAP's pixel rounding cannot flatten the animation", async () => {
    mockMatchMedia(false);
    const { container } = render(<OrbitLine chapterIds={IDS} />);
    const path = container.querySelector("path")!;
    expect(path).toHaveAttribute("pathLength", "1000");
    expect(path).toHaveAttribute("stroke-dasharray", "1000");
    expect(path).toHaveAttribute("stroke-dashoffset", "1000");
    await engage();
    // three equal chapters: the first tween ends two thirds undrawn
    expect(timeline.to.mock.calls[0][1].strokeDashoffset).toBeCloseTo((2 / 3) * 1000, 3);
  });

  it("kills the timeline and its ScrollTrigger on unmount", async () => {
    mockMatchMedia(false);
    const view = render(<OrbitLine chapterIds={IDS} />);
    await engage();
    view.unmount();
    expect(timeline.scrollTrigger.kill).toHaveBeenCalled();
    expect(timeline.kill).toHaveBeenCalled();
  });

  it("does not load GSAP if unmounted before the browser is idle", async () => {
    mockMatchMedia(false);
    const view = render(<OrbitLine chapterIds={IDS} />);
    view.unmount();
    await engage();
    expect(gsap.timeline).not.toHaveBeenCalled();
  });
});
