import type { Metadata } from "next";
import { fontDisplay, fontMono, fontSerif } from "@/lib/fonts";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Adhish Pawar",
  description: "Building AI products from scratch to scale.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSerif.variable} ${fontMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
