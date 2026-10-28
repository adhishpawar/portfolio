import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "@/lib/site";
import { buildLlmsTxt } from "@/lib/llms";
import { loadContent } from "@/lib/content";

afterEach(() => vi.unstubAllEnvs());

describe("getSiteUrl", () => {
  it("returns NEXT_PUBLIC_SITE_URL without a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://adhish.example/");
    expect(getSiteUrl()).toBe("https://adhish.example");
  });

  it("falls back to localhost outside production", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("throws, naming the variable, when VERCEL_ENV is production and it is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(() => getSiteUrl()).toThrowError(/NEXT_PUBLIC_SITE_URL/);
  });
});

describe("llms.txt route", () => {
  it("serves buildLlmsTxt as text/plain; charset=utf-8", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://adhish.example");
    const { GET } = await import("@/app/llms.txt/route");
    const res = await GET();
    expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(await res.text()).toBe(buildLlmsTxt(loadContent(), "https://adhish.example"));
  });
});
