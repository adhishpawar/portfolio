import styles from "./HandLineArt.module.scss";

// Abstract line art of an open hand with three tracked points. Decorative only:
// real pilot imagery is used only with permission.
export function HandLineArt() {
  return (
    <svg className={styles.hand} aria-hidden="true" focusable="false" viewBox="0 0 160 270">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M40 220 C20 190 18 150 28 118 L34 60 C35 48 52 48 52 60 L54 112 L58 36 C59 24 76 24 76 36 L78 112 L84 44 C85 32 102 32 102 44 L100 118 L108 70 C110 58 126 62 124 74 L112 150 C108 190 100 210 92 228 Z" />
        <path d="M40 220 L40 250 H92 L92 228" />
        <path className={styles.tracker} d="M68 17 L68 28 M127 150 L112 148 M7 130 L24 128" />
      </g>
      <circle className={styles.point} cx="68" cy="14" r="3" />
      <circle className={styles.point} cx="130" cy="150" r="3" />
      <circle className={styles.point} cx="4" cy="130" r="3" />
    </svg>
  );
}
