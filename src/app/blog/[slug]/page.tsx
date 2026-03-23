import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import AdBanner from "@/components/AdBanner";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | SabTools.in Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `https://sabtools.in/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://sabtools.in/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "SabTools.in",
      url: "https://sabtools.in",
    },
    publisher: {
      "@type": "Organization",
      name: "SabTools.in",
      url: "https://sabtools.in",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sabtools.in/blog/${post.slug}`,
    },
    keywords: post.keywords.join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sabtools.in" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://sabtools.in/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://sabtools.in/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                {post.category}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                {post.readTime}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(post.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-gray-600">{post.description}</p>
          </header>

          <AdBanner format="horizontal" className="mb-8" />

          <div
            className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-li:marker:text-indigo-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <AdBanner format="horizontal" className="mt-10" />
        </article>

        {/* Related Posts */}
        <section className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="tool-card group block"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                      {rp.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {rp.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition text-sm mb-2 line-clamp-2">
                    {rp.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 flex-grow">
                    {rp.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <AdBanner format="rectangle" className="mt-10" />
      </div>
    </>
  );
}
