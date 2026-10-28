const LOCAL_URL = "http://localhost:3000";

// Order of preference:
//   1. NEXT_PUBLIC_SITE_URL, for a custom domain.
//   2. On Vercel production, the project's own address, which Vercel provides to
//      the build, so the first deploy needs no setup.
//   3. On Vercel previews, that deployment's address.
//   4. localhost, for local development.
// A production build with none of these fails loudly instead of shipping wrong links.
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  if (process.env.VERCEL_ENV === "production") {
    const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
    if (production) return `https://${production}`;
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set. Add it to the Production environment in Vercel (for example https://your-domain.com).",
    );
  }

  const preview = process.env.VERCEL_URL?.trim();
  if (preview) return `https://${preview}`;
  return LOCAL_URL;
}
