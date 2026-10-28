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
