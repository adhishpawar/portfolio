import styles from "./SiteHeader.module.scss";
import { NavMenu, type NavItem } from "./NavMenu";

export type { NavItem };

export function SiteHeader({ name, items }: { name: string; items: NavItem[] }) {
  return (
    <header className={styles.header}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <span className={styles.name}>{name}</span>
      <NavMenu items={items} />
    </header>
  );
}
