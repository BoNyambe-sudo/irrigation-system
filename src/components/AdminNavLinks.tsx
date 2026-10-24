"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ShoppingBag, Users, Package, Map } from "lucide-react";

const icons: Record<string, any> = { "/admin": LayoutGrid, "/admin/orders": ShoppingBag, "/admin/map": Map, "/admin/products": Package, "/admin/customers": Users };

export default function AdminNavLinks({ items, collapsed }: { items: { href: string; label: string; badge?: number }[]; collapsed?: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1 flex-1">
      {items.map((n) => {
        const Icon = icons[n.href];
        const active = pathname === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} gap-2 px-3 py-2 rounded-lg text-sm ${active ? "bg-green-100 text-green-900 font-semibold" : "text-green-900 hover:bg-green-50"}`}
          >
            <span className="flex items-center gap-2">
              <Icon className="w-4 h-4" /> {!collapsed && n.label}
            </span>
            {!collapsed && n.badge !== undefined && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {n.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}