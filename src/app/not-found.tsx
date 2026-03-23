import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-gray-500 mb-8">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="btn-primary inline-block">
        Go to Homepage
      </Link>
    </div>
  );
}
