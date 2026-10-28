import type { Chapter, Profile } from "@/content/schema";

export const BOOT_MS = 2600;
export const BOOT_STORAGE_KEY = "boot-seen";
// Backstop: if hydration lands later than this, the visitor has been reading for
// a while. (Scrolling and deep links are the primary guards, in isPristineLoad.)
export const BOOT_MAX_HYDRATION_MS = 6000;

export function shouldPlayBoot({
  reduced,
  seen,
  pristine,
}: {
  reduced: boolean;
  seen: boolean;
  pristine: boolean;
}): boolean {
  return !reduced && !seen && pristine;
}

// The readout belongs to the first moment of a visit. It must not pop up over
// text someone is already reading (slow hydration), after they scrolled, or when
// they arrived on a deep link such as /#ch-07.
export function isPristineLoad(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.scrollY === 0 &&
    window.location.hash === "" &&
    performance.now() < BOOT_MAX_HYDRATION_MS
  );
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
