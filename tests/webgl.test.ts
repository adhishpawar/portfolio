import { describe, expect, it } from "vitest";
import { shouldUseWebGL, type WebGLEnv } from "@/lib/webgl";
import { glowFragment, halftoneFragment, orbVertex } from "@/components/webgl/shaders";

const DESKTOP: WebGLEnv = {
  reduced: false,
  saveData: false,
  hasWebGL: true,
  viewportWidth: 1440,
  deviceMemory: 8,
};

describe("shouldUseWebGL", () => {
  it("is true for a capable desktop", () => {
    expect(shouldUseWebGL(DESKTOP)).toBe(true);
  });

  it.each([
    ["reduced motion", { reduced: true }],
    ["data saver", { saveData: true }],
    ["no WebGL", { hasWebGL: false }],
    ["a phone-width viewport", { viewportWidth: 767 }],
    ["low device memory", { deviceMemory: 2 }],
  ])("is false for %s", (_label, patch) => {
    expect(shouldUseWebGL({ ...DESKTOP, ...patch })).toBe(false);
  });

  it("treats an unknown device memory as capable", () => {
    expect(shouldUseWebGL({ ...DESKTOP, deviceMemory: undefined })).toBe(true);
  });

  it("allows exactly 768px wide and exactly 4 GB", () => {
    expect(shouldUseWebGL({ ...DESKTOP, viewportWidth: 768, deviceMemory: 4 })).toBe(true);
  });
});

describe("shaders", () => {
  it("declares the halftone uniforms uTime, uLight and uStep", () => {
    expect(halftoneFragment).toMatch(/uniform float uTime;/);
    expect(halftoneFragment).toMatch(/uniform vec3 uLight;/);
    expect(halftoneFragment).toMatch(/uniform float uStep;/);
  });

  it("uses the approved palette, accent blue to signal white", () => {
    // #2F5BFF and #F4F4F4 as 0..1 vec3 components
    expect(halftoneFragment).toContain("vec3(0.184, 0.357, 1.0)");
    expect(halftoneFragment).toContain("vec3(0.957, 0.957, 0.957)");
  });

  it("has a vertex shader and a glow fragment shader that write gl_Position / gl_FragColor", () => {
    expect(orbVertex).toContain("gl_Position");
    expect(glowFragment).toContain("gl_FragColor");
  });
});
