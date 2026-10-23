export function Footer() {
  return (
    <footer className="bg-green-900 text-green-50 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p>&copy; {new Date().getFullYear()} Smart Irrigation Zambia. All rights reserved.</p>
        <p className="text-green-200">Irrigation solutions for Zambian farms.</p>
      </div>
    </footer>
  );
}