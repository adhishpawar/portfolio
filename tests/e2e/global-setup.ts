// Warms the production server before any test runs. The first request for the hero
// image makes Next.js encode it (AVIF is slow), which would delay hydration of the
// first tests past the boot readout's "early load" window and make them flaky.
const BASE = "http://localhost:3100";

export default async function globalSetup(): Promise<void> {
  await fetch(`${BASE}/`);
  const widths = [384, 640, 750, 1080];
  const formats = ["image/avif", "image/webp"];
  for (const w of widths) {
    for (const accept of formats) {
      await fetch(`${BASE}/_next/image?url=%2Fimages%2Fhalftone-orb.png&w=${w}&q=40`, {
        headers: { accept },
      });
    }
  }
}
