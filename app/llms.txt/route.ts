import { loadContent } from "@/lib/content";
import { buildLlmsTxt } from "@/lib/llms";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  return new Response(buildLlmsTxt(loadContent(), getSiteUrl()), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
