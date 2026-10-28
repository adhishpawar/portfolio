import type { Content } from "@/content/schema";

export function buildPersonJsonLd(content: Content, siteUrl: string): Record<string, unknown> {
  const { profile } = content;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    jobTitle: profile.role.title,
    worksFor: { "@type": "Organization", name: profile.role.company },
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.school },
    sameAs: [profile.links.linkedin, profile.links.github],
  };
}

const BACKSLASH = String.fromCharCode(92);

// JSON for an inline <script type="application/ld+json">. Every "<" becomes the
// escape backslash-u003c, which JSON.parse reads back as "<" but which can never
// close the script tag.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, `${BACKSLASH}u003c`);
}
