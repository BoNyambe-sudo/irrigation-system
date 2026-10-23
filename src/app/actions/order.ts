"server-only";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { pay } from "@/lib/payments";
import { emitOrderCreated, emitOrderStatusChange } from "@/lib/realtime";

export const ZambianDistricts = [
  "Central",
  "Copperbelt",
  "Eastern",
  "Luapula",
  "Lusaka",
  "Muchinga",
  "Northern",
  "North-Western",
  "Southern",
  "Western",
];

const OrderSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(5, "Phone is required"),
  whatsapp: z.string().min(5, "WhatsApp number required"),
  district: z.string().min(1, "District is required"),
  address: z.string().min(5, "Address is required"),
  farmSize: z.number().positive("Farm size is required"),
  waterSource: z.string().min(1, "Water source is required"),
  cropType: z.string().min(1, "Crop type is required"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
  sitePhotos: z.array(z.string()).default([]),
  paymentMethod: z.enum(["MOMO", "AIRTEL", "CARD", "CASH"]),
});

export type OrderInput = z.infer<typeof OrderSchema>;

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

  const customer = await prisma.customer.upsert({
    where: { phone: data.phone },
    update: { name: data.name, whatsapp: data.whatsapp, district: data.district },
    create: {
      name: data.name,
      phone: data.phone,
      whatsapp: data.whatsapp,
      district: data.district,
    },
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

export async function createProduct(input: {
  slug: string;
  name: string;
  type: string;
  coverageAcres: number;
  priceZMW: number;
  features: string[];
  images: string[];
  specs: Record<string, unknown>;
}) {
  return prisma.product.create({ data: input as any });
}

export async function updateProduct(
  id: string,
  input: Partial<{
    slug: string;
    name: string;
    type: string;
    coverageAcres: number;
    priceZMW: number;
    features: string[];
    images: string[];
    specs: Record<string, unknown>;
  }>
) {
  return prisma.product.update({ where: { id }, data: input as any });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}