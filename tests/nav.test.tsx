import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it } from "vitest";
import { mockMatchMedia } from "./helpers/matchMedia";
import { ConnectButton } from "@/components/ui/ConnectButton";
import { NavMenu } from "@/components/ui/NavMenu";
import { loadMotionFeatures, MotionRoot } from "@/components/motion/MotionRoot";

const ITEMS = [
  { label: "Story", href: "#ch-01" },
  { label: "Work", href: "#ch-04" },
  { label: "Connect", href: "#ch-07" },
];

beforeEach(() => mockMatchMedia(false));

describe("NavMenu", () => {
  it("server markup is a plain list of anchor links with no toggle (works without JavaScript)", () => {
    const html = renderToStaticMarkup(<NavMenu items={ITEMS} />);
    const root = document.createElement("div");
    root.innerHTML = html;
    expect(root.querySelector("nav")?.getAttribute("aria-label")).toBe("Primary");
    expect([...root.querySelectorAll("a")].map((a) => a.getAttribute("href"))).toEqual(
      ITEMS.map((i) => i.href),
    );
    expect(root.querySelector("button")).toBeNull();
  });

  it("toggle button has aria-expanded that flips on click", async () => {
    const user = userEvent.setup();
    render(<NavMenu items={ITEMS} />);
    const toggle = screen.getByRole("button", { name: "Menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("Escape closes the menu and returns focus to the toggle", async () => {
    const user = userEvent.setup();
    render(<NavMenu items={ITEMS} />);
    const toggle = screen.getByRole("button", { name: "Menu" });
    await user.click(toggle);
    await user.tab();
    expect(screen.getByRole("link", { name: "Story" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("reaches every item with Tab when open", async () => {
    const user = userEvent.setup();
    render(<NavMenu items={ITEMS} />);
    await user.click(screen.getByRole("button", { name: "Menu" }));
    for (const item of ITEMS) {
      await user.tab();
      expect(screen.getByRole("link", { name: item.label })).toHaveFocus();
    }
  });
});

describe("ConnectButton", () => {
  it("renders a plain link with the href", () => {
    render(<ConnectButton href="https://example.com/in">Let&apos;s connect</ConnectButton>);
    expect(screen.getByRole("link", { name: "Let's connect" })).toHaveAttribute(
      "href",
      "https://example.com/in",
    );
  });

  it("still renders the same link when reduced motion is on", () => {
    mockMatchMedia(true);
    render(<ConnectButton href="https://example.com/in">Let&apos;s connect</ConnectButton>);
    expect(screen.getByRole("link", { name: "Let's connect" })).toHaveAttribute(
      "href",
      "https://example.com/in",
    );
  });
});

describe("MotionRoot", () => {
  it("renders its children and loads the dom animation features lazily", async () => {
    render(
      <MotionRoot>
        <p>child</p>
      </MotionRoot>,
    );
    expect(screen.getByText("child")).toBeInTheDocument();
    const features = await loadMotionFeatures();
    expect(Object.keys(features)).toEqual(expect.arrayContaining(["animation", "hover", "tap"]));
  });
});
