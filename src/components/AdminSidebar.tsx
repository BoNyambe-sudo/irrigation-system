"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminNavLinks from "@/components/AdminNavLinks";
import { LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminSidebar({ items, name }: { items: { href: string; label: string; badge?: number }[]; name: string }) {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 768) setCollapsed(true);
  }, []);

  return (
    <div className="relative shrink-0 sticky top-0 h-screen">
      <aside className={`${collapsed ? "w-16" : "w-64"} bg-white border-r border-green-100 p-4 flex flex-col sticky top-0 self-start h-screen overflow-y-auto transition-all duration-200`}>
        <div className="flex items-center gap-2 font-bold text-green-800 mb-6">
          <Link href="/admin" className="flex items-center gap-2">
            <LayoutGrid className="w-6 h-6" />
            {!collapsed && <span>Admin</span>}
          </Link>
        </div>
        <AdminNavLinks items={items} collapsed={collapsed} />
        <div className="pt-4 border-t border-green-100 text-xs text-gray-500">
          {!collapsed && <>Signed in as {name || "Admin"}</>}
        </div>
      </aside>
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
        className="absolute top-6 -right-3 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-green-200 bg-white text-green-700 shadow hover:bg-green-50"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}