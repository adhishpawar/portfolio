import styles from "./SiteHeader.module.scss";

export interface NavItem {
  label: string;
  href: string;
}

export function SiteHeader({ name, items }: { name: string; items: NavItem[] }) {
  return (
    <header className={styles.header}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <span className={styles.name}>{name}</span>
      <nav className={styles.nav} aria-label="Primary">
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.href}>
              <a className={styles.link} href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
