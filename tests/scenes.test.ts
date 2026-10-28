import { beforeEach, describe, expect, it, vi } from "vitest";

// A fake `three` that can simulate what the real renderer does when a shader
// fails to compile: it logs and calls debug.onShaderError, but does not throw.
const { state, renderers, observers } = vi.hoisted(() => ({
  state: { failShaders: false },
  renderers: [] as { dispose: () => void; forceContextLoss: () => void }[],
  observers: [] as { disconnect: () => void }[],
}));

vi.mock("three", () => {
  class WebGLRenderer {
    debug: { onShaderError?: () => void } = {};
    setPixelRatio = vi.fn();
    setSize = vi.fn();
    render = vi.fn(() => {
      if (state.failShaders) this.debug.onShaderError?.();
    });
    dispose = vi.fn();
    forceContextLoss = vi.fn();
    constructor() {
      renderers.push(this);
    }
  }
  class Scene {
    add = vi.fn();
  }
  class Mesh {}
  class OrthographicCamera {}
  class PlaneGeometry {
    dispose = vi.fn();
  }
  class ShaderMaterial {
    dispose = vi.fn();
  }
  class Vector2 {
    set = vi.fn();
  }
  class Vector3 {}
  return { WebGLRenderer, Scene, Mesh, OrthographicCamera, PlaneGeometry, ShaderMaterial, Vector2, Vector3 };
});

class FakeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  constructor() {
    observers.push(this);
  }
}

beforeEach(() => {
  state.failShaders = false;
  renderers.length = 0;
  observers.length = 0;
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  vi.stubGlobal("ResizeObserver", FakeObserver);
});

describe("mountScene", () => {
  it.each(["orb", "glow"] as const)("starts the %s scene when the shaders compile", async (kind) => {
    const { mountScene } = await import("@/components/webgl/scenes");
    const handle = mountScene(kind, document.createElement("canvas"));
    expect(typeof handle.dispose).toBe("function");
    expect(renderers[0].dispose).not.toHaveBeenCalled();
    handle.dispose();
    expect(renderers[0].dispose).toHaveBeenCalledTimes(1);
  });

  it.each(["orb", "glow"] as const)(
    "throws and releases everything when the %s shader fails, so the static image stays visible",
    async (kind) => {
      state.failShaders = true;
      const { mountScene } = await import("@/components/webgl/scenes");
      expect(() => mountScene(kind, document.createElement("canvas"))).toThrowError(/shader/i);
      expect(renderers[0].dispose).toHaveBeenCalled();
      expect(renderers[0].forceContextLoss).toHaveBeenCalled();
      for (const observer of observers) expect(observer.disconnect).toHaveBeenCalled();
    },
  );
});
