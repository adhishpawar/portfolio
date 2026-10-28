import { describe, expect, it } from "vitest";
import { loadContent } from "@/lib/content";
import { buildPersonJsonLd } from "@/lib/jsonld";

describe("buildPersonJsonLd", () => {
  const content = loadContent();
  const ld = buildPersonJsonLd(content, "https://adhish.example") as {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    jobTitle: string;
    worksFor: Record<string, string>;
    sameAs: string[];
  };

  it("describes a Person with the current job title and employer", () => {
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe("Adhish Pawar");
    expect(ld.jobTitle).toBe("Associate Software Engineer");
    expect(ld.worksFor).toMatchObject({
      "@type": "Organization",
      name: "CoReCo Technologies Private Limited",
    });
  });

  it("links to LinkedIn and GitHub through sameAs", () => {
    expect(ld.sameAs).toEqual(
      expect.arrayContaining([content.profile.links.linkedin, content.profile.links.github]),
    );
    expect(ld.url).toBe("https://adhish.example");
  });
});
