import { ContentError, loadContent } from "../lib/content";

try {
  const content = loadContent();
  console.log(
    `content ok: ${content.chapters.length} chapters, ${content.projects.length} projects`,
  );
} catch (error) {
  if (error instanceof ContentError) {
    console.error(`content error in ${error.message}`);
  } else {
    console.error(error);
  }
  process.exit(1);
}
