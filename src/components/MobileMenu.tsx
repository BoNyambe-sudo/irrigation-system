"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Menu, X, User, LogOut } from "lucide-react";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="p-2">
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-green-100 shadow-md z-50">
          <nav className="flex flex-col p-4 gap-3 text-sm text-gray-700">
            <Link href="/systems" onClick={() => setOpen(false)}>Systems</Link>
            <Link href="/order" onClick={() => setOpen(false)}>Order</Link>
            {role === "ADMIN" && <Link href="/admin" onClick={() => setOpen(false)}>Dashboard</Link>}
            {session?.user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                >
                  <User className="w-4 h-4 inline mr-1" /> Account
                </Link>
                <button
                  onClick={() => { setOpen(false); signOut(); }}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signup" onClick={() => setOpen(false)}>Sign up</Link>
                <Link href="/auth/signin" onClick={() => setOpen(false)}>Sign in</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}