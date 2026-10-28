"use client";

import { useEffect, useRef, useState } from "react";
import { whenIdle } from "@/lib/idle";
import { detectWebGLEnv, shouldUseWebGL, type WebGLEnv } from "@/lib/webgl";
import type { SceneHandle, SceneKind } from "./scenes";
import styles from "./WebGLCanvas.module.scss";

interface WebGLCanvasProps {
  scene: SceneKind;
  getEnv?: () => WebGLEnv;
}

// Renders nothing until the browser is idle and WebGL is allowed. Three.js is
// imported only then. If the context is lost or fails to start, the canvas is
// removed and whatever sits underneath it (a static image) stays visible.
export function WebGLCanvas({ scene, getEnv = detectWebGLEnv }: WebGLCanvasProps) {
  const [wanted, setWanted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return whenIdle(() => {
      if (shouldUseWebGL(getEnv())) setWanted(true);
    });
  }, [getEnv]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!wanted || failed || !canvas) return;

    let handle: SceneHandle | undefined;
    let cancelled = false;

    const onLost = (event: Event) => {
      event.preventDefault();
      handle?.dispose();
      handle = undefined;
      setFailed(true);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    import("./scenes")
      .then(({ mountScene }) => {
        if (cancelled) return;
        try {
          handle = mountScene(scene, canvas);
          setReady(true);
        } catch {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      canvas.removeEventListener("webglcontextlost", onLost);
      handle?.dispose();
      handle = undefined;
    };
  }, [wanted, failed, scene]);

  if (!wanted || failed) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-ready={ready ? "" : undefined}
      className={styles.canvas}
    />
  );
}
