import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { glowFragment, halftoneFragment, orbVertex } from "./shaders";

export type SceneKind = "orb" | "glow";

export interface SceneHandle {
  dispose: () => void;
}

// Starts a full-canvas shader scene. Throws when no WebGL context can be made;
// the caller keeps the static fallback in that case. Rendering pauses while the
// canvas is off-screen or the tab is hidden.
export function mountScene(kind: SceneKind, canvas: HTMLCanvasElement): SceneHandle {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });

  const uniforms = {
    uTime: { value: 0 },
    uLight: { value: new Vector3(-0.55, 0.6, 0.58) },
    uStep: { value: 10 },
    uResolution: { value: new Vector2(1, 1) },
  };
  const geometry = new PlaneGeometry(2, 2);
  const material = new ShaderMaterial({
    vertexShader: orbVertex,
    fragmentShader: kind === "orb" ? halftoneFragment : glowFragment,
    uniforms,
    transparent: true,
  });
  const scene = new Scene();
  scene.add(new Mesh(geometry, material));
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(ratio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    uniforms.uResolution.value.set(canvas.clientWidth * ratio, canvas.clientHeight * ratio);
    renderer.render(scene, camera);
  };

  let frame = 0;
  let visible = true;
  const tick = (time: number) => {
    uniforms.uTime.value = time / 1000;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };
  const update = () => {
    const shouldRun = visible && !document.hidden;
    if (shouldRun && !frame) frame = requestAnimationFrame(tick);
    if (!shouldRun && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  });
  observer.observe(canvas);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  document.addEventListener("visibilitychange", update);

  resize();
  update();

  return {
    dispose() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", update);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
