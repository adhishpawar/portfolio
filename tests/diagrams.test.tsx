import { render, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "./helpers/matchMedia";
import { HandLineArt } from "@/components/diagrams/HandLineArt";
import { PipelineDiagram } from "@/components/diagrams/PipelineDiagram";
import { useFlagshipPin } from "@/components/motion/useFlagshipPin";

const NODES = [
  { id: "data", label: "Data", detail: "DVC, versioned" },
  { id: "experiments", label: "Experiments", detail: "MLflow, registry" },
  { id: "serving", label: "Serving", detail: "Django REST, Flask" },
];

const { loads, timeline, gsap } = vi.hoisted(() => {
  const loads = { gsap: 0, scrollTrigger: 0 };
  const timeline = { from: vi.fn(), kill: vi.fn(), scrollTrigger: { kill: vi.fn() } };
  timeline.from.mockReturnValue(timeline);
  const gsap = {
    registerPlugin: vi.fn(),
    timeline: vi.fn((config?: { scrollTrigger?: { pin?: unknown } }) => {
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

describe("PipelineDiagram", () => {
  it("renders one box per node, in order, with its label and detail", () => {
    const { container } = render(<PipelineDiagram nodes={NODES} title="FifthSense pipeline" />);
    const boxes = [...container.querySelectorAll("[data-node]")];
    expect(boxes).toHaveLength(3);
    expect(boxes.map((b) => b.getAttribute("data-node"))).toEqual(["data", "experiments", "serving"]);
    expect(boxes[1].textContent).toContain("Experiments");
    expect(boxes[1].textContent).toContain("MLflow, registry");
  });

  it("is an accessible image named by its title", () => {
    const { container } = render(<PipelineDiagram nodes={NODES} title="FifthSense pipeline" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("role", "img");
    const titleId = svg.getAttribute("aria-labelledby")!;
    expect(container.querySelector(`#${titleId}`)?.textContent).toBe("FifthSense pipeline");
  });

  it("exposes a text equivalent as an ordered list with the same labels in the same order", () => {
    const { container } = render(<PipelineDiagram nodes={NODES} title="FifthSense pipeline" />);
    const items = [...container.querySelectorAll("ol.sr-only li")].map((li) => li.textContent);
    expect(items).toHaveLength(3);
    expect(items[0]).toContain("Data");
    expect(items[2]).toContain("Django REST, Flask");
  });

  it("renders nothing, without throwing, for zero nodes", () => {
    const { container } = render(<PipelineDiagram nodes={[]} title="Empty" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("copes with a single node", () => {
    const { container } = render(<PipelineDiagram nodes={[NODES[0]]} title="One" />);
    expect(container.querySelectorAll("[data-node]")).toHaveLength(1);
  });
});

describe("HandLineArt", () => {
  it("is decorative: aria-hidden", () => {
    const { container } = render(<HandLineArt />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("useFlagshipPin", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.resetModules();
    loads.gsap = 0;
    loads.scrollTrigger = 0;
  });
  afterEach(() => vi.useRealTimers());

  const target = () => {
    const el = document.createElement("section");
    el.innerHTML = '<div data-node="a"></div><div data-node="b"></div>';
    document.body.append(el);
    return el;
  };

  it("does nothing and imports no gsap when reduced motion is on", async () => {
    mockMatchMedia(true, true);
    const el = target();
    renderHook(() => useFlagshipPin(() => el));
    await vi.advanceTimersByTimeAsync(5000);
    expect(loads.gsap).toBe(0);
  });

  it("does not pin on a narrow screen", async () => {
    mockMatchMedia(false, false);
    const el = target();
    renderHook(() => useFlagshipPin(() => el));
    await vi.advanceTimersByTimeAsync(5000);
    expect(loads.gsap).toBe(0);
  });

  it("pins the target on a wide screen after idle and lights the nodes in order", async () => {
    mockMatchMedia(false, true);
    const el = target();
    renderHook(() => useFlagshipPin(() => el));
    await vi.advanceTimersByTimeAsync(5000);
    expect(gsap.registerPlugin).toHaveBeenCalledWith({ name: "ScrollTrigger" });
    const config = gsap.timeline.mock.calls[0][0] as { scrollTrigger: { pin: unknown } };
    expect(config.scrollTrigger.pin).toBe(true);
    expect(timeline.from).toHaveBeenCalledTimes(1);
  });

  it("kills the timeline and trigger on unmount", async () => {
    mockMatchMedia(false, true);
    const el = target();
    const view = renderHook(() => useFlagshipPin(() => el));
    await vi.advanceTimersByTimeAsync(5000);
    view.unmount();
    expect(timeline.scrollTrigger.kill).toHaveBeenCalled();
    expect(timeline.kill).toHaveBeenCalled();
  });

  it("does nothing when the target element does not exist", async () => {
    mockMatchMedia(false, true);
    renderHook(() => useFlagshipPin(() => null));
    await vi.advanceTimersByTimeAsync(5000);
    expect(loads.gsap).toBe(0);
  });
});
