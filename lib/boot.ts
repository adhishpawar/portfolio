import type { Chapter, Profile } from "@/content/schema";

export const BOOT_MS = 2600;
export const BOOT_STORAGE_KEY = "boot-seen";

export function shouldPlayBoot({ reduced, seen }: { reduced: boolean; seen: boolean }): boolean {
  return !reduced && !seen;
}

// Session storage can be blocked (private windows, cleared site data), so every
// access is guarded and the boot simply plays again.
export function hasSeenBoot(): boolean {
  try {
    return window.sessionStorage.getItem(BOOT_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markBootSeen(): void {
  try {
    window.sessionStorage.setItem(BOOT_STORAGE_KEY, "1");
  } catch {
    // nothing to do: the intro just replays next visit
  }
}

export function bootLines(profile: Profile, chapter: Chapter): string[] {
  const number = String(chapter.index).padStart(2, "0");
  return [
    `> initialising orbit for ${profile.name}`,
    `> ${profile.location}`,
    `> chapter ${number} loaded`,
    "> press any key to skip",
  ];
}
