import type { WebGLEnv } from "@/lib/webgl";
import styles from "./HeroOrb.module.scss";
import { StaticOrb } from "./StaticOrb";
import { WebGLCanvas } from "./WebGLCanvas";

export function HeroOrb({ getEnv }: { getEnv?: () => WebGLEnv }) {
  return (
    <div className={styles.orb}>
      <StaticOrb />
      <WebGLCanvas scene="orb" getEnv={getEnv} />
    </div>
  );
}
