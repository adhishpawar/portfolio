import styles from "./Chapter.module.scss";

export function Body({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((text, i) => (
        <p key={i} className={styles.body}>
          {text}
        </p>
      ))}
    </>
  );
}
