import type { Profile } from "@/content/schema";
import styles from "./SiteFooter.module.scss";

export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <footer className={styles.footer}>
      <span>
        {profile.name} / {profile.location}
      </span>
      <span>
        <a href={profile.links.linkedin}>LinkedIn</a> / <a href={profile.links.github}>GitHub</a>
      </span>
    </footer>
  );
}
