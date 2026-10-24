"use server";

import { prisma } from "@/lib/prisma";
import { pay } from "@/lib/payments";
import { emitOrderCreated, emitOrderStatusChange } from "@/lib/realtime";
import { revalidatePath } from "next/cache";
import type { OrderInput } from "@/app/actions/orderSchema";

export async function createOrder(input: OrderInput) {
  const parsed = OrderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: data.productId } });
  if (!product) {
    return { success: false as const, error: "Product not found." };
  }

  // Price per acre * farm size, rounded to whole kwacha
  const pricePerAcre = product.priceZMW / Math.max(product.coverageAcres, 0.1);
  const amount = Math.round(pricePerAcre * data.farmSize);

  const payment = await pay(data.paymentMethod, amount, data.phone);

  const existingCustomer = await prisma.customer.findFirst({ where: { phone: data.phone } });
  const customer = existingCustomer
    ? await prisma.customer.update({
        where: { id: existingCustomer.id },
        data: { name: data.name, whatsapp: data.whatsapp, district: data.district },
      })
    : await prisma.customer.create({
        data: { name: data.name, phone: data.phone, whatsapp: data.whatsapp, district: data.district },
      });

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      productId: product.id,
      farmSize: data.farmSize,
      waterSource: data.waterSource,
      cropType: data.cropType,
      lat: data.lat,
      lng: data.lng,
      accuracy: data.accuracy ?? null,
      address: data.address,
      district: data.district,
      amount,
      paymentMethod: data.paymentMethod,
      paymentStatus: payment.success ? "PAID" : "PENDING",
      status: payment.success ? "REVIEWING" : "PENDING",
      sitePhotos: data.sitePhotos,
    },
  });

  await prisma.orderTimeline.create({
    data: {
      orderId: order.id,
      status: order.status,
      note: payment.success
        ? `Payment received (${payment.provider ?? "mock"}). Reference: ${payment.reference}. Order under review.`
        : `Order created. Payment pending (${payment.reference}).`,
    },
  });

  emitOrderCreated(order);
  emitOrderStatusChange(order);

  return { success: true as const, orderId: order.id, reference: payment.reference };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as any },
  });

  await prisma.orderTimeline.create({
    data: {
      orderId: order.id,
      status: order.status,
      note: `Status updated to ${status} by admin.`,
    },
  });

  emitOrderStatusChange(order);


  return { success: true as const, order };
}

export async function deleteOrder(orderId: string) {
  await prisma.order.delete({ where: { id: orderId } });
  return { success: true as const };
}

// Product CRUD — accept FormData from <form action=...>
export async function createProduct(formData: FormData) {
  const slug = String(formData.get("slug") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const coverageAcres = Number(formData.get("coverageAcres"));
  const priceZMW = Number(formData.get("priceZMW"));
  const features = String(formData.get("features") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const images = String(formData.get("images") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const specs: Record<string, unknown> = {};
  for (const line of String(formData.get("specs") || "").split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  if (!slug || !name || isNaN(coverageAcres) || isNaN(priceZMW)) {
    throw new Error("Missing required fields");
  }
  await prisma.product.create({
    data: { slug, name, type, coverageAcres, priceZMW, features, images, specs: specs as any },
  });
  revalidatePath("/admin/products");
  revalidatePath("/systems");
}

export async function updateProduct(formData: FormData) {
  const id = String(formData.get("id") || "");
  const slug = String(formData.get("slug") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const coverageAcres = Number(formData.get("coverageAcres"));
  const priceZMW = Number(formData.get("priceZMW"));
  const features = String(formData.get("features") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const images = String(formData.get("images") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const specs: Record<string, unknown> = {};
  for (const line of String(formData.get("specs") || "").split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  if (!id) throw new Error("Missing id");
  await prisma.product.update({
    where: { id },
    data: { slug, name, type, coverageAcres, priceZMW, features, images, specs: specs as any },
  });
  revalidatePath("/admin/products");
  revalidatePath("/systems");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/systems");}
