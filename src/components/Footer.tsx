import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-green-900 text-green-50 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p>&copy; {new Date().getFullYear()} Smart Irrigation Zambia. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/terms" className="text-green-200 hover:text-white transition">Terms</Link>
          <Link href="/privacy" className="text-green-200 hover:text-white transition">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}