"use client";

import { m } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { useHydrated } from "@/components/motion/useHydrated";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import styles from "./NavMenu.module.scss";

export interface NavItem {
  label: string;
  href: string;
}

// Without JavaScript this is a plain list of anchors. After hydration a Menu
// toggle appears on small screens and the list collapses behind it.
export function NavMenu({ items }: { items: NavItem[] }) {
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <nav
      aria-label="Primary"
      className={styles.nav}
      data-enhanced={hydrated ? "" : undefined}
      data-open={open ? "" : undefined}
    >
      {hydrated ? (
        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      ) : null}
      <ul id={listId} className={styles.list}>
        {items.map((item) => (
          <li key={item.href}>
            <m.a
              className={styles.link}
              href={item.href}
              whileHover={reduced ? undefined : { y: -1 }}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </m.a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
