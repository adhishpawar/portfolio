import { describe, expect, it } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const config = require("../next.config.js") as {
  headers: () => Promise<{ source: string; headers: { key: string; value: string }[] }[]>;
};

async function headersFor(source: string): Promise<Record<string, string>> {
  const rules = await config.headers();
  const rule = rules.find((r) => r.source === source);
  expect(rule, `no header rule for ${source}`).toBeDefined();
  return Object.fromEntries(rule!.headers.map((h) => [h.key, h.value]));
}

describe("next.config headers()", () => {
  it("caches fingerprinted build assets for a year, immutable", async () => {
    const headers = await headersFor("/_next/static/:path*");
    expect(headers["Cache-Control"]).toBe("public, max-age=31536000, immutable");
  });

  it("caches the public images for a day, not immutable, because their names are not fingerprinted", async () => {
    const headers = await headersFor("/images/:path*");
    expect(headers["Cache-Control"]).toContain("max-age=86400");
    expect(headers["Cache-Control"]).not.toContain("immutable");
  });

  it("sends the baseline security headers on every route", async () => {
    const headers = await headersFor("/:path*");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["X-Frame-Options"]).toBe("DENY");
  });
});
