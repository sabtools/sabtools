import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact SabTools.in for feedback, suggestions or bug reports.",
  alternates: { canonical: "https://sabtools.in/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Contact Us</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <p className="text-gray-600 mb-6">Have feedback, suggestions, or found a bug? We would love to hear from you!</p>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <span className="text-2xl">📧</span>
            <div>
              <div className="text-sm font-semibold text-gray-700">Email</div>
              <div className="text-gray-600">contact@sabtools.in</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <span className="text-2xl">🌐</span>
            <div>
              <div className="text-sm font-semibold text-gray-700">Website</div>
              <div className="text-gray-600">https://sabtools.in</div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-6">We typically respond within 24-48 hours.</p>
      </div>
    </div>
  );
}
