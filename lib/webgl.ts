export interface WebGLEnv {
  reduced: boolean;
  saveData: boolean;
  hasWebGL: boolean;
  viewportWidth: number;
  deviceMemory?: number;
}

const MIN_VIEWPORT = 768;
const MIN_MEMORY_GB = 4;

// WebGL is a desktop enhancement. Reduced-motion visitors, data-saver users,
// phones and low-memory devices keep the static image.
export function shouldUseWebGL(env: WebGLEnv): boolean {
  if (env.reduced || env.saveData || !env.hasWebGL) return false;
  if (env.viewportWidth < MIN_VIEWPORT) return false;
  if (env.deviceMemory !== undefined && env.deviceMemory < MIN_MEMORY_GB) return false;
  return true;
}

interface NavigatorHints {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

export function detectWebGLEnv(): WebGLEnv {
  const hints = navigator as Navigator & NavigatorHints;
  return {
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: hints.connection?.saveData === true,
    // A cheap presence check; a context that still fails to start is handled by the fallback.
    hasWebGL: typeof window.WebGLRenderingContext !== "undefined",
    viewportWidth: window.innerWidth,
    deviceMemory: hints.deviceMemory,
  };
}
