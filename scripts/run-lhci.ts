import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// Runs Lighthouse CI (desktop, then mobile) against an already-built site.
// Lighthouse's own launcher cannot start Edge on some machines, so this starts a
// headless Chromium-family browser with a debugging port, points Lighthouse at
// it, and always shuts it down afterwards.
const PORT = 9333;
const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter((candidate): candidate is string => Boolean(candidate));

const browser = CANDIDATES.find((candidate) => existsSync(candidate));
if (!browser) {
  console.error("No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser.");
  process.exit(1);
}

const profile = mkdtempSync(path.join(tmpdir(), "lhci-profile-"));
const child = spawn(
  browser,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

async function waitForBrowser(): Promise<void> {
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (response.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("the debugging browser did not start");
}

async function main(): Promise<number> {
  let failed = false;
  try {
    await waitForBrowser();
    for (const config of ["lighthouserc.js", "lighthouserc.mobile.js"]) {
      console.log(`
=== Lighthouse CI: ${config} ===`);
      const result = spawnSync(
        "npx",
        ["lhci", "autorun", `--config=${config}`, `--collect.settings.port=${PORT}`],
        { stdio: "inherit", shell: true, env: { ...process.env, CHROME_PATH: browser } },
      );
      if (result.status !== 0) failed = true;
    }
  } finally {
    child.kill();
  }
  return failed ? 1 : 0;
}

main().then((code) => process.exit(code));
