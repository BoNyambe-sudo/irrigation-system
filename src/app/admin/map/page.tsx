import { prisma } from "@/lib/prisma";
import AdminMapPage from "@/components/AdminMapPage";

export default async function AdminMap() {
  const orders = await prisma.order.findMany({
    include: { customer: true, product: true },
    orderBy: { createdAt: "desc" },
  });
  return <AdminMapPage orders={orders as any} />;
}