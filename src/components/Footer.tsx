import Link from "next/link";
import { categories } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="text-xl font-bold text-white">
                Sab<span className="text-indigo-400">Tools</span>.in
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Free online tools for everyone. 70+ calculators, converters, text tools, developer tools and more. No signup, no limits, 100% free.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-sm text-gray-400 hover:text-indigo-400 transition">
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              {[
                { name: "EMI Calculator", slug: "emi-calculator" },
                { name: "SIP Calculator", slug: "sip-calculator" },
                { name: "GST Calculator", slug: "gst-calculator" },
                { name: "Word Counter", slug: "word-counter" },
                { name: "JSON Formatter", slug: "json-formatter" },
                { name: "Image Compressor", slug: "image-compressor" },
              ].map((t) => (
                <li key={t.slug}>
                  <Link href={`/tools/${t.slug}`} className="text-sm text-gray-400 hover:text-indigo-400 transition">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-indigo-400 transition">About Us</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-indigo-400 transition">Blog</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-indigo-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-400 hover:text-indigo-400 transition">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-indigo-400 transition">Contact Us</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-gray-400 hover:text-indigo-400 transition">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SabTools.in. All rights reserved. Made with ❤️ in India
          </p>
          <p className="text-xs text-gray-600">
            Free online tools for calculators, converters, text utilities & developer tools
          </p>
        </div>
      </div>
    </footer>
  );
}
