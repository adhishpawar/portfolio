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

  it("falls back to localhost outside production when Vercel gives no address", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("uses Vercel's production address when NEXT_PUBLIC_SITE_URL is not set, so the first deploy needs no setup", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "portfolio-adhish.vercel.app");
    expect(getSiteUrl()).toBe("https://portfolio-adhish.vercel.app");
  });

  it("prefers NEXT_PUBLIC_SITE_URL (a custom domain) over Vercel's address", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://adhish.dev");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "portfolio-adhish.vercel.app");
    expect(getSiteUrl()).toBe("https://adhish.dev");
  });

  it("uses the deployment address for preview builds", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "portfolio-git-feat-abc.vercel.app");
    expect(getSiteUrl()).toBe("https://portfolio-git-feat-abc.vercel.app");
  });

  it("throws, naming the variable, when VERCEL_ENV is production and it is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
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
