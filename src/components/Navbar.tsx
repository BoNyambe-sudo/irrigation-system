import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LayoutGrid, ShoppingBag, User, LogOut } from "lucide-react";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-green-100 bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-green-800 text-lg">
          <LayoutGrid className="w-6 h-6 text-green-700" />
          <span>Smart Irrigation Zambia</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <Link href="/systems" className="hover:text-green-700 transition">Systems</Link>
          <Link href="/order" className="hover:text-green-700 transition">Order</Link>
          {role === "ADMIN" ? (
            <Link href="/admin" className="hover:text-green-700 transition">Admin</Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <Link href={role === "ADMIN" ? "/admin" : "/"} className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-700">
              <User className="w-4 h-4" />
              {(session.user as any).name || "Account"}
            </Link>
          ) : (
            <Link href="/auth/signin" className="text-sm text-gray-700 hover:text-green-700 flex items-center gap-1">
              <User className="w-4 h-4" /> Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}