import { z } from "zod";

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
] as const;

export const OrderSchema = z.object({
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