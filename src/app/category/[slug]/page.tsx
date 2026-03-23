import { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, tools } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import Breadcrumb from "@/components/Breadcrumb";
import AdBanner from "@/components/AdBanner";

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return {};
  const toolCount = tools.filter((t) => t.category === slug).length;
  return {
    title: `${cat.name} - ${toolCount} Free Online Tools | SabTools.in`,
    description: `${cat.description}. ${toolCount} free online ${cat.name.toLowerCase()} tools. No signup required, 100% free, instant results. Made for India.`,
    keywords: [cat.name.toLowerCase(), "free tools", "online tools", "sabtools", "india", "no signup"],
    alternates: { canonical: `https://sabtools.in/category/${slug}` },
    openGraph: {
      title: `${cat.name} - ${toolCount} Free Online Tools | SabTools.in`,
      description: `${cat.description}. ${toolCount} free tools available.`,
      url: `https://sabtools.in/category/${slug}`,
      type: "website",
      locale: "en_IN",
      siteName: "SabTools.in",
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const catTools = tools.filter((t) => t.category === slug);

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} - Free Online Tools`,
    description: cat.description,
    url: `https://sabtools.in/category/${slug}`,
    numberOfItems: catTools.length,
    hasPart: catTools.slice(0, 10).map((t) => ({
      "@type": "WebApplication",
      name: t.name,
      url: `https://sabtools.in/tools/${t.slug}`,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sabtools.in" },
      { "@type": "ListItem", position: 2, name: cat.name, item: `https://sabtools.in/category/${slug}` },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: cat.name }]} />

      <div className="mb-10">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} text-white text-3xl shadow-lg mb-4`}>
          {cat.icon}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{cat.name}</h1>
        <p className="text-lg text-gray-600">{cat.description}</p>
        <p className="text-sm text-gray-400 mt-2">{catTools.length} free tools available</p>
      </div>

      <AdBanner format="horizontal" className="mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {catTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      <AdBanner format="horizontal" className="mt-10" />
    </div>
  );
}
