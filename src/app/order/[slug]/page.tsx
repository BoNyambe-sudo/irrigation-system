import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CheckoutForm from "@/components/CheckoutForm";

type Props = { params: Promise<{ slug: string }> };

export default async function OrderPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-green-900 mb-2">Order: {product.name}</h1>
      <p className="text-gray-600 mb-8">
        Complete 5 quick steps. Your order is created only after final confirmation.
      </p>
      <CheckoutForm product={product} />
    </main>
  );
}