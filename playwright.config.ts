import { defineConfig } from "@playwright/test";

// Runs against the production build on port 3100, in the installed Edge so no
// browser download is needed. SwiftShader gives headless WebGL.
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 120_000,
  // software WebGL is CPU-heavy: two browsers at a time keeps timings honest
  workers: 2,
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    channel: "msedge",
    launchOptions: {
      args: ["--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"],
    },
  },
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
