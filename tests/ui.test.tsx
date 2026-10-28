import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { SectionShell } from "@/components/ui/SectionShell";

describe("SectionShell", () => {
  it("renders an h1 for level 1 and an h2 for level 2", () => {
    const { rerender } = render(
      <SectionShell id="ch-00" labelledBy="t-00" level={1} title="Hello">
        body
      </SectionShell>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Hello" })).toBeInTheDocument();
    rerender(
      <SectionShell id="ch-01" labelledBy="t-01" level={2} title="Hello">
        body
      </SectionShell>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Hello" })).toBeInTheDocument();
  });

  it("is a named region whose aria-labelledby points at the heading id", () => {
    render(
      <SectionShell id="ch-04" labelledBy="t-04" level={2} title="Teaching a system to *understand* people.">
        body
      </SectionShell>,
    );
    const region = screen.getByRole("region", { name: "Teaching a system to understand people." });
    expect(region).toHaveAttribute("id", "ch-04");
    expect(region).toHaveAttribute("aria-labelledby", "t-04");
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("id", "t-04");
  });

  it("renders marked words as <em>", () => {
    const { container } = render(
      <SectionShell id="a" labelledBy="b" level={2} title="Beyond *the terminal.*">
        x
      </SectionShell>,
    );
    expect(container.querySelector("em")?.textContent).toBe("the terminal.");
  });

  it("sets overflow-wrap: anywhere on the heading so long titles cannot scroll sideways", () => {
    const scss = readFileSync("components/ui/SectionShell.module.scss", "utf8");
    expect(scss).toContain("overflow-wrap: anywhere");
  });
});

describe("Button", () => {
  it("renders an anchor with the given href and visible text", () => {
    render(<Button href="https://example.com/x">Let&apos;s connect</Button>);
    const link = screen.getByRole("link", { name: "Let's connect" });
    expect(link).toHaveAttribute("href", "https://example.com/x");
  });
});

describe("Label", () => {
  it("shows the chapter index in brackets before the text", () => {
    const { container } = render(<Label index="04">FifthSense / Glovatrix</Label>);
    expect(container.textContent).toContain("[04]");
    expect(container.textContent).toContain("FifthSense / Glovatrix");
  });
});
