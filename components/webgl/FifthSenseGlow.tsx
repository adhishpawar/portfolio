import type { WebGLEnv } from "@/lib/webgl";
import styles from "./FifthSenseGlow.module.scss";
import { WebGLCanvas } from "./WebGLCanvas";

export function FifthSenseGlow({ getEnv }: { getEnv?: () => WebGLEnv }) {
  return (
    <div className={styles.glow} aria-hidden="true">
      <div data-glow-fallback className={styles.fallback} />
      <WebGLCanvas scene="glow" getEnv={getEnv} />
    </div>
  );
}
