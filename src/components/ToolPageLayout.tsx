import Breadcrumb from "@/components/Breadcrumb";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ShareButtons from "@/components/ShareButtons";
import WhatsAppShareResult from "@/components/WhatsAppShareResult";
import EmbedCode from "@/components/EmbedCode";
import ToolFaq from "@/components/ToolFaq";
import TrackToolVisit from "@/components/TrackToolVisit";
import FavoriteButton from "@/components/FavoriteButton";
import type { Tool } from "@/lib/tools";
import { categories } from "@/lib/tools";

interface ToolPageLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

export default function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const cat = categories.find((c) => c.slug === tool.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `https://sabtools.in/tools/${tool.slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sabtools.in" },
      { "@type": "ListItem", position: 2, name: cat?.name || "", item: `https://sabtools.in/category/${tool.category}` },
      { "@type": "ListItem", position: 3, name: tool.name, item: `https://sabtools.in/tools/${tool.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <TrackToolVisit slug={tool.slug} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: cat?.name || "", href: `/category/${tool.category}` },
            { label: tool.name },
          ]}
        />

        <div className="mb-8">
          <div className="flex items-start sm:items-center gap-4 mb-3 flex-col sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl shadow-sm">
                {tool.icon}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{tool.name}</h1>
                <p className="text-gray-500">{tool.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton slug={tool.slug} />
              <ShareButtons title={`${tool.name} - Free Online Tool | SabTools.in`} />
            </div>
          </div>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {children}
        </div>

        <div className="mt-6 flex items-center justify-center">
          <WhatsAppShareResult toolName={tool.name} slug={tool.slug} />
        </div>

        <EmbedCode slug={tool.slug} />

        <AdBanner format="horizontal" className="mt-8" />

        {/* SEO Content */}
        <div className="mt-12 prose prose-gray max-w-none">
          <h2 className="text-xl font-bold text-gray-800">About {tool.name}</h2>
          <p className="text-gray-600">
            {tool.name} is a free online tool available on SabTools.in. {tool.description}.
            This tool is completely free to use, requires no signup, and works instantly in your browser.
            Your data stays private as all calculations happen on your device.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-6">How to use {tool.name}?</h3>
          <ol className="text-gray-600 list-decimal list-inside space-y-1">
            <li>Enter the required values in the input fields above</li>
            <li>The results will be calculated automatically in real-time</li>
            <li>You can copy or share the results as needed</li>
          </ol>
          <h3 className="text-lg font-semibold text-gray-800 mt-6">Why use SabTools.in?</h3>
          <ul className="text-gray-600 list-disc list-inside space-y-1">
            <li>100% free — no signup, no limits, no hidden fees</li>
            <li>Lightning fast — runs instantly in your browser</li>
            <li>Privacy first — your data never leaves your device</li>
            <li>Mobile friendly — works on any phone, tablet or computer</li>
            <li>Made for India — Indian number formats, GST, EMI & more</li>
          </ul>
        </div>

        {/* FAQ Section with Schema */}
        <ToolFaq toolName={tool.name} description={tool.description} />

        {/* Related Tools */}
        <RelatedTools currentSlug={tool.slug} category={tool.category} />

        <AdBanner format="rectangle" className="mt-8" />
      </div>
    </>
  );
}
