import type { Metadata } from "next";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { loadContent } from "@/lib/content";
import { fontDisplay, fontMono, fontSerif } from "@/lib/fonts";
import { buildPersonJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { getSiteUrl } from "@/lib/site";
import "@/styles/globals.scss";

const content = loadContent();
const siteUrl = getSiteUrl();
const description = content.chapters[0].body[0];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Adhish Pawar | Building AI products from scratch to scale",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: siteUrl,
    title: "Adhish Pawar",
    description,
    siteName: "Adhish Pawar",
  },
  twitter: { card: "summary_large_image", title: "Adhish Pawar", description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = serializeJsonLd(buildPersonJsonLd(content, siteUrl));
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSerif.variable} ${fontMono.variable}`}
    >
      <body>
        <MotionRoot>
          <LenisProvider>{children}</LenisProvider>
        </MotionRoot>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </body>
    </html>
  );
}
