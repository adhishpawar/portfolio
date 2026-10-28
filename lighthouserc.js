// Desktop run: the spec targets a performance score of 0.99 or better.
module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3100/"],
      startServerCommand: "npm run start -- -p 3100",
      startServerReadyPattern: "Ready",
      numberOfRuns: 3,
      chromePath: process.env.CHROME_PATH || undefined,
      settings: { preset: "desktop", chromeFlags: "--headless=new --no-sandbox --enable-unsafe-swiftshader" },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.99 }],
        "categories:accessibility": ["error", { minScore: 0.98 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.98 }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/desktop" },
  },
};
