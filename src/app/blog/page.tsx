import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import AdBanner from "@/components/AdBanner";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Financial Tips, Tax Guides & Tool Tutorials | SabTools.in",
  description:
    "Read expert articles on EMI calculation, SIP investing, GST rates, income tax tips, and how to use free online tools. Practical financial guides for Indians.",
  alternates: { canonical: "https://sabtools.in/blog" },
  openGraph: {
    title: "Blog — Financial Tips, Tax Guides & Tool Tutorials | SabTools.in",
    description:
      "Expert articles on personal finance, tax planning, and free online tools for Indians.",
    url: "https://sabtools.in/blog",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Blog
        </h1>
        <p className="text-lg text-gray-600">
          Financial tips, tax guides, investment insights, and tool tutorials
          for everyday Indians.
        </p>
      </div>

      <AdBanner format="horizontal" className="mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="tool-card group block"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                  {post.category}
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  {post.readTime}
                </span>
              </div>
              <h2 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition text-base mb-2 line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-grow">
                {post.description}
              </p>
              <div className="text-xs text-gray-400 mt-auto">
                {new Date(post.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <AdBanner format="horizontal" className="mt-10" />
    </div>
  );
}
