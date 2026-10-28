import { ImageResponse } from "next/og";
import { loadContent } from "@/lib/content";

export const alt = "Adhish Pawar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const { profile, chapters } = loadContent();
  const parts = chapters[0].title.split("*");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0D0D0D",
          color: "#F4F4F4",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#9F9F9F" }}>
          {profile.name.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 92, fontWeight: 700, lineHeight: 1 }}>
          {parts.map((part, i) => (
            <span key={i} style={{ color: i % 2 ? "#7C97FF" : "#F4F4F4", marginRight: 20 }}>
              {part}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9F9F9F" }}>
          {profile.role.title}, {profile.role.company}
        </div>
      </div>
    ),
    size,
  );
}
