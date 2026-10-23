import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import Link from "next/link";
import { LayoutGrid, ShoppingBag, Users, Package, Map, TrendingUp, Bell } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/auth/signin");

  const [orders, products, customers] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.customer.count(),
  ]);

  const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutGrid },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag, badge: orders },
    { href: "/admin/map", label: "Map", icon: Map },
    { href: "/admin/products", label: "Products", icon: Package, badge: products },
    { href: "/admin/customers", label: "Customers", icon: Users, badge: customers },
  ];

  return (
    <div className="min-h-screen bg-green-50/30 flex">
      <aside className="w-64 shrink-0 bg-white border-r border-green-100 p-4 flex flex-col">
        <div className="flex items-center gap-2 font-bold text-green-800 mb-6">
          <LayoutGrid className="w-6 h-6" /> Admin
        </div>
        <nav className="space-y-1 flex-1">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm text-green-900 hover:bg-green-50"
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" /> {n.label}
                </span>
                {n.badge !== undefined && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    {n.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="pt-4 border-t border-green-100 text-xs text-gray-500">
          Signed in as {(session.user as any).name || "Admin"}
        </div>
      </aside>
      <main className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-900">Admin dashboard</h1>
          <Link href="/" className="text-sm text-green-700 hover:underline">
            ← View store
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}