"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LayoutGrid, ShoppingBag, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/Button";
import MobileMenu from "@/components/MobileMenu";

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-green-100 bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-green-800 text-lg"
        >
          <LayoutGrid className="w-6 h-6 text-green-700" />
          <span>Smart Irrigation Zambia</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <Link href="/systems" className="hover:text-green-700 transition">
            Systems
          </Link>
          <Link href="/order" className="hover:text-green-700 transition">
            Order
          </Link>
          <Link href="/my-orders" className="hover:text-green-700 transition">
            Track order
          </Link>
          {role === "ADMIN" ? (
            <Link href="/admin" className="hover:text-green-700 transition">
              Dashboard
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            {session?.user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-700"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {(session.user as any).name || "Account"}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                  className="text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="text-sm text-gray-700 hover:text-green-700"
                >
                  Sign up
                </Link>
                <Link
                  href="/auth/signin"
                  className="text-sm text-gray-700 hover:text-green-700 flex items-center gap-1"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
