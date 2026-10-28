import Image from "next/image";
import styles from "./HeroOrb.module.scss";

// The server-rendered orb. It is the largest contentful paint element, so it
// loads with priority and never waits for WebGL. Quality 40 keeps this dot
// pattern around 85 KB instead of 180 KB, which matters on slow phone connections.
export function StaticOrb() {
  return (
    <Image
      className={styles.static}
      src="/images/halftone-orb.png"
      alt=""
      width={900}
      height={900}
      priority
      fetchPriority="high"
      quality={40}
      sizes="(min-width: 60rem) 40rem, 200px"
    />
  );
}
