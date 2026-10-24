import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
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
    { href: "/admin", label: "Dashboard", badge: undefined },
    { href: "/admin/orders", label: "Orders", badge: orders },
    { href: "/admin/map", label: "Map" },
    { href: "/admin/products", label: "Products", badge: products },
    { href: "/admin/customers", label: "Customers", badge: customers },
  ];

  return (
    <div className="h-screen overflow-hidden bg-green-50/30 flex">
      <AdminSidebar items={nav} name={(session.user as any).name || "Admin"} />
      <main className="flex-1 p-2 md:p-6 overflow-auto min-w-0">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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