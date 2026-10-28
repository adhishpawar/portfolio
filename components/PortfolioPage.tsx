import type { Content } from "@/content/schema";
import { ChapterRenderer } from "./chapters/ChapterRenderer";
import { SiteFooter } from "./ui/SiteFooter";
import { SiteHeader, type NavItem } from "./ui/SiteHeader";

const NAV_LABEL_BY_KIND = {
  origin: "Story",
  flagship: "Work",
  explorer: "Explorer",
  connect: "Connect",
} as const;

type NavKind = keyof typeof NAV_LABEL_BY_KIND;

export function PortfolioPage({ content }: { content: Content }) {
  const { profile, chapters, projects, explorer } = content;
  const navItems: NavItem[] = chapters.flatMap((chapter) =>
    chapter.kind in NAV_LABEL_BY_KIND
      ? [{ label: NAV_LABEL_BY_KIND[chapter.kind as NavKind], href: `#${chapter.id}` }]
      : [],
  );

  return (
    <>
      <SiteHeader name={profile.name} items={navItems} />
      <main id="main" tabIndex={-1}>
        {chapters.map((chapter) => (
          <ChapterRenderer
            key={chapter.id}
            chapter={chapter}
            projects={projects}
            explorer={explorer}
            profile={profile}
          />
        ))}
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}
