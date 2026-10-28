import { readFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

// Fails when the heavy animation libraries leak into the initial JavaScript of "/".
// Framer Motion's LazyMotion and `m` are small and intentionally in the initial
// bundle; its feature set is loaded dynamically, so it is covered by the size budget.
// Markers are strings that exist only inside each library's own code. (The bare
// name "ScrollTrigger" is not usable: our own code destructures a property of that name.)
const FORBIDDEN: { library: string; marker: string }[] = [
  { library: "gsap core", marker: "gsapVersions" },
  { library: "gsap ScrollTrigger", marker: "scroller-start" },
  { library: "three.js", marker: "WebGLRenderer" },
  { library: "lenis", marker: "lenis-smooth" },
];
const BUDGET_GZIP_KB = 170;

const root = process.cwd();
const html = readFileSync(path.join(root, ".next/server/app/index.html"), "utf8");

// <script ... noModule> is Next's legacy polyfill bundle: browsers that support
// modules never download or run it, so it does not count.
const tags = [...html.matchAll(/<script[^>]*>/g)].map((m) => m[0]);
const scripts = tags
  .filter((tag) => !/nomodule/i.test(tag))
  .map((tag) => tag.match(/src="(\/_next\/static\/[^"]+\.js)"/)?.[1])
  .filter((src): src is string => Boolean(src));
const unique = [...new Set(scripts)];
if (unique.length === 0) {
  console.error("no initial scripts found in .next/server/app/index.html; run `npm run build` first");
  process.exit(1);
}

let totalGzip = 0;
const problems: string[] = [];

for (const src of unique) {
  const file = path.join(root, ".next", src.replace("/_next/", ""));
  const code = readFileSync(file, "utf8");
  const gzip = gzipSync(code).length;
  totalGzip += gzip;
  console.log(`${(gzip / 1024).toFixed(1).padStart(7)} KB gzip  ${src}`);
  for (const { library, marker } of FORBIDDEN) {
    if (code.includes(marker)) problems.push(`${library} (found "${marker}") is in initial chunk ${src}`);
  }
}

const totalKb = totalGzip / 1024;
console.log(`${totalKb.toFixed(1).padStart(7)} KB gzip  total initial JavaScript (budget ${BUDGET_GZIP_KB} KB)`);
if (totalKb > BUDGET_GZIP_KB) problems.push(`initial JavaScript is ${totalKb.toFixed(1)} KB gzip, over the ${BUDGET_GZIP_KB} KB budget`);

if (problems.length > 0) {
  console.error(["", "bundle check failed:", ...problems.map((p) => `  - ${p}`)].join("\n"));
  process.exit(1);
}
console.log("bundle check passed");
