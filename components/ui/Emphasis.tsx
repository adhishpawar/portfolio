import { Fragment } from "react";
import { parseEmphasis } from "@/lib/emphasis";
import styles from "./Emphasis.module.scss";

export function Emphasis({ text }: { text: string }) {
  return (
    <>
      {parseEmphasis(text).map((segment, i) =>
        segment.em ? (
          <em key={i} className={styles.em}>
            {segment.text}
          </em>
        ) : (
          <Fragment key={i}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
}
