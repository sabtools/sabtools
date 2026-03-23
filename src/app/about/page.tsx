import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "About Us",
  description: "SabTools.in provides 70+ free online tools including calculators, converters, text tools, developer tools and more for India.",
  alternates: { canonical: "https://sabtools.in/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">About SabTools.in</h1>
      <div className="prose prose-gray max-w-none space-y-4">
        <p>Welcome to <strong>SabTools.in</strong> — your one-stop destination for free online tools. We provide 70+ utility tools including calculators, converters, text tools, developer tools, image tools, and SEO tools.</p>
        <h2 className="text-xl font-bold">Our Mission</h2>
        <p>To provide fast, free, and easy-to-use online tools for everyone in India. All our tools work instantly in your browser with zero server processing, ensuring your data stays completely private.</p>
        <h2 className="text-xl font-bold">Why SabTools.in?</h2>
        <ul>
          <li><strong>100% Free</strong> — No signup, no limits, no hidden charges</li>
          <li><strong>Privacy First</strong> — All processing happens in your browser</li>
          <li><strong>Lightning Fast</strong> — Instant results, no server delays</li>
          <li><strong>Mobile Friendly</strong> — Works on any device</li>
          <li><strong>Made for India</strong> — Indian number formats, GST, EMI tools & more</li>
        </ul>
        <h2 className="text-xl font-bold">Contact</h2>
        <p>Have suggestions or found a bug? We would love to hear from you. Visit our <a href="/contact" className="text-indigo-600 hover:underline">Contact page</a>.</p>
      </div>
    </div>
  );
}
