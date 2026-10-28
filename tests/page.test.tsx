import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PortfolioPage } from "@/components/PortfolioPage";
import { loadContent } from "@/lib/content";

function dom(html: string): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = html;
  return root;
}

const content = loadContent();
const html = renderToStaticMarkup(<PortfolioPage content={content} />);
const root = dom(html);

describe("PortfolioPage server HTML (no JavaScript needed)", () => {
  it("contains the exact chapter 00 headline text", () => {
    expect(root.querySelector("h1")?.textContent).toBe(
      "Building AI products from scratch to scale.",
    );
  });

  it("has all eight chapter sections with ids ch-00 to ch-07", () => {
    const ids = [...root.querySelectorAll("main > section")].map((s) => s.id);
    expect(ids).toEqual([0, 1, 2, 3, 4, 5, 6, 7].map((i) => `ch-0${i}`));
  });

  it("has exactly one h1 and an h2 for every other chapter", () => {
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(root.querySelectorAll("main h2").length).toBeGreaterThanOrEqual(7);
  });

  it("starts with a Skip to content link that targets #main", () => {
    const first = root.querySelector("a");
    expect(first?.textContent).toBe("Skip to content");
    expect(first?.getAttribute("href")).toBe("#main");
    expect(root.querySelector("main#main")).not.toBeNull();
  });

  it("shows the FifthSense quote and the Royal Orchid line", () => {
    const flagship = root.querySelector("#ch-04");
    expect(flagship?.textContent).toContain("That's the only metric that really counts.");
    expect(flagship?.textContent).toContain("First pilot: Royal Orchid Hotels, Bangalore.");
  });

  it("links the primary nav to chapter anchors", () => {
    const hrefs = [...root.querySelectorAll('nav[aria-label="Primary"] a')].map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual(["#ch-01", "#ch-04", "#ch-06", "#ch-07"]);
  });

  it("offers the connect call to action and never says open to work", () => {
    expect(root.querySelector("#ch-00")?.textContent).toContain("Let's connect");
    expect(root.textContent).not.toMatch(/open to work|open to opportunities|hire me/i);
  });

  it("renders the projects a chapter references", () => {
    const foundations = root.querySelector("#ch-02")?.textContent ?? "";
    expect(foundations).toContain("UPI Replication System");
    expect(foundations).toContain("FinSec Vault");
  });
});

describe("PortfolioPage is decoupled from the data", () => {
  it("shows a changed headline without any component change", () => {
    const changed = structuredClone(content);
    changed.chapters[0].title = "A completely *different* headline.";
    const other = dom(renderToStaticMarkup(<PortfolioPage content={changed} />));
    expect(other.querySelector("h1")?.textContent).toBe("A completely different headline.");
    expect(other.textContent).not.toContain("scratch to scale.");
  });
});
