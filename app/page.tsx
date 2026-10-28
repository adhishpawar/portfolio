import { PortfolioPage } from "@/components/PortfolioPage";
import { loadContent } from "@/lib/content";

export default function Home() {
  return <PortfolioPage content={loadContent()} />;
}
