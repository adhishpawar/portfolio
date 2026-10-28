// Mobile run (Lighthouse's default emulated phone). WebGL is off on phones, so the
// spec's realistic target is 0.95 or better.
module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3100/"],
      startServerCommand: "npm run start -- -p 3100",
      startServerReadyPattern: "Ready",
      numberOfRuns: 5,
      chromePath: process.env.CHROME_PATH || undefined,
      settings: { chromeFlags: "--headless=new --no-sandbox --enable-unsafe-swiftshader" },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.98 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.98 }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/mobile" },
  },
};
