import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import AdBanner from "@/components/AdBanner";
import RecentlyUsed from "@/components/RecentlyUsed";
import FavoriteTools from "@/components/FavoriteTools";
import { categories, tools } from "@/lib/tools";

export default function HomePage() {
  const popularTools = [
    "emi-calculator", "sip-calculator", "gst-calculator", "age-calculator",
    "word-counter", "json-formatter", "image-compressor", "percentage-calculator",
  ];

  const popular = popularTools.map((slug) => tools.find((t) => t.slug === slug)!).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SabTools.in",
    url: "https://sabtools.in",
    description: `${tools.length}+ Free Online Tools - Calculators, Converters, AI Tools, PDF Tools, Developer Tools & More`,
    potentialAction: {
      "@type": "SearchAction",
      target: "https://sabtools.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SabTools.in",
    url: "https://sabtools.in",
    description: "India's #1 free online tools website with 280+ tools.",
    sameAs: [],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Popular Free Online Tools",
    numberOfItems: popular.length,
    itemListElement: popular.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      url: `https://sabtools.in/tools/${tool.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      {/* Hero Section */}
      <section className="relative overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium text-indigo-600 shadow-sm border border-indigo-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {tools.length}+ Free Tools — No Signup Required
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              <span className="text-gray-900">All </span>
              <span className="gradient-text">Free Online Tools</span>
              <br />
              <span className="text-gray-900">in One Place</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Calculators, Converters, Text Tools, Developer Tools, Image Tools & more.
              100% free, fast and easy to use. Built for India.
            </p>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <AdBanner format="horizontal" />
      </div>

      {/* Recently Used Tools */}
      <RecentlyUsed />

      {/* Favorite Tools */}
      <FavoriteTools />

      {/* Popular Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">🔥 Most Popular Tools</h2>
          <p className="text-gray-500 mt-2">Our most-used tools by millions of Indians</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">📂 Browse by Category</h2>
          <p className="text-gray-500 mt-2">Find the right tool for your needs</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const count = tools.filter((t) => t.category === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="glass-card p-6 group block"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white text-2xl mb-4 shadow-lg group-hover:scale-110 transition`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{cat.description}</p>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {count} tools
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdBanner format="horizontal" />
      </div>

      {/* All Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">🛠️ All Tools</h2>
          <p className="text-gray-500 mt-2">Complete list of all {tools.length} free online tools</p>
        </div>
        {categories.map((cat) => {
          const catTools = tools.filter((t) => t.category === cat.slug);
          return (
            <div key={cat.slug} className="mb-12">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>{cat.icon}</span> {cat.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Why Choose Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Choose SabTools.in?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "⚡", title: "Lightning Fast", desc: "All tools run instantly in your browser. No server delays." },
              { icon: "🔒", title: "100% Private", desc: "Your data never leaves your device. Everything runs locally." },
              { icon: "🆓", title: "Completely Free", desc: "No signup, no limits, no hidden fees. Free forever." },
              { icon: "📱", title: "Mobile Friendly", desc: "Works perfectly on phone, tablet and desktop." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
