import { act, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FifthSenseGlow } from "@/components/webgl/FifthSenseGlow";
import { HeroOrb } from "@/components/webgl/HeroOrb";
import { StaticOrb } from "@/components/webgl/StaticOrb";
import type { ReactElement } from "react";
import type { WebGLEnv } from "@/lib/webgl";

const { loads, dispose, mountScene } = vi.hoisted(() => {
  const loads = { count: 0 };
  const dispose = vi.fn();
  const mountScene = vi.fn((kind: string, canvas: HTMLCanvasElement) => {
    void kind;
    void canvas;
    return { dispose };
  });
  return { loads, dispose, mountScene };
});

vi.mock("@/components/webgl/scenes", () => {
  loads.count++;
  return { mountScene };
});

const CAPABLE: WebGLEnv = {
  reduced: false,
  saveData: false,
  hasWebGL: true,
  viewportWidth: 1440,
  deviceMemory: 8,
};
const idle = () => act(async () => { await vi.advanceTimersByTimeAsync(5000); });
const capable = () => CAPABLE;
const incapable = () => ({ ...CAPABLE, hasWebGL: false });

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  vi.resetModules(); // so the mock factory re-runs, and loads.count reflects this test only
  loads.count = 0;
});

afterEach(() => vi.useRealTimers());

describe("HeroOrb", () => {
  it("server markup is the static orb image and has no canvas (it is the LCP element)", () => {
    const html = renderToStaticMarkup(<HeroOrb />);
    expect(html).toContain("<img");
    expect(html).toContain("halftone-orb");
    expect(html).not.toContain("<canvas");
  });

  it("fetches the static orb at high priority and at quality 40, so it paints fast on slow phones", () => {
    expect(renderToStaticMarkup(<HeroOrb />)).toContain('fetchPriority="high"');
    // Quality is checked on the element: next/image only honours it when the
    // config allows it, and the unit test environment has no config.
    const orb = StaticOrb() as ReactElement<{ quality: number; fetchPriority: string }>;
    expect(orb.props.quality).toBe(40);
    expect(orb.props.fetchPriority).toBe("high");
  });

  it("allows quality 40 in the Next image config", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const config = require("../next.config.js") as { images: { qualities: number[] } };
    expect(config.images.qualities).toContain(40);
  });

  it("never loads the scene module when WebGL is not allowed", async () => {
    const { container } = render(<HeroOrb getEnv={incapable} />);
    await idle();
    expect(loads.count).toBe(0);
    expect(container.querySelector("canvas")).toBeNull();
    expect(container.querySelector("img")).not.toBeNull();
  });

  it("mounts the orb scene on a canvas after idle when allowed, keeping the static image beneath", async () => {
    const { container } = render(<HeroOrb getEnv={capable} />);
    expect(container.querySelector("canvas")).toBeNull();
    await idle();
    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect(mountScene).toHaveBeenCalledWith("orb", canvas);
    expect(container.querySelector("img")).not.toBeNull();
  });

  it("removes the canvas and disposes the scene when the WebGL context is lost, leaving the static orb", async () => {
    const { container } = render(<HeroOrb getEnv={capable} />);
    await idle();
    const canvas = container.querySelector("canvas")!;
    await act(async () => {
      canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
    });
    expect(container.querySelector("canvas")).toBeNull();
    expect(dispose).toHaveBeenCalled();
    expect(container.querySelector("img")).not.toBeNull();
  });

  it("falls back to the static orb, without crashing, when the scene fails to start", async () => {
    mountScene.mockImplementationOnce(() => {
      throw new Error("no webgl context");
    });
    const { container } = render(<HeroOrb getEnv={capable} />);
    await idle();
    expect(container.querySelector("canvas")).toBeNull();
    expect(container.querySelector("img")).not.toBeNull();
  });

  it("disposes the scene on unmount", async () => {
    const view = render(<HeroOrb getEnv={capable} />);
    await idle();
    view.unmount();
    expect(dispose).toHaveBeenCalledTimes(1);
  });
});

describe("FifthSenseGlow", () => {
  it("uses the glow scene and keeps a CSS fallback underneath", async () => {
    const { container } = render(<FifthSenseGlow getEnv={capable} />);
    expect(container.querySelector("[data-glow-fallback]")).not.toBeNull();
    await idle();
    expect(mountScene).toHaveBeenCalledWith("glow", container.querySelector("canvas"));
  });

  it("stays CSS-only when WebGL is not allowed", async () => {
    const { container } = render(<FifthSenseGlow getEnv={incapable} />);
    await idle();
    expect(loads.count).toBe(0);
    expect(container.querySelector("canvas")).toBeNull();
    expect(container.querySelector("[data-glow-fallback]")).not.toBeNull();
  });
});
