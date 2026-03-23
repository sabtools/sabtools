import { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools, categories } from "@/lib/tools";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolRenderer from "./ToolRenderer";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};
  const cat = categories.find((c) => c.slug === tool.category);
  return {
    title: `${tool.name} - Free Online ${tool.name} | SabTools.in`,
    description: `${tool.description}. Use our free online ${tool.name.toLowerCase()} tool — no signup, instant results, 100% free. Works on mobile & desktop. Made for India.`,
    keywords: [...(tool.keywords || []), "free online tool", "sabtools", "india", "no signup", tool.name.toLowerCase()],
    alternates: { canonical: `https://sabtools.in/tools/${slug}` },
    openGraph: {
      title: `${tool.name} - Free Online Tool | SabTools.in`,
      description: `${tool.description}. 100% free, no signup required.`,
      url: `https://sabtools.in/tools/${slug}`,
      type: "website",
      locale: "en_IN",
      siteName: "SabTools.in",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} - Free Online Tool`,
      description: `${tool.description}. Free, no signup, instant results.`,
    },
    other: {
      "rating": "general",
      "revisit-after": "7 days",
      "distribution": "global",
      "target": "all",
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <ToolRenderer slug={slug} />
    </ToolPageLayout>
  );
}
