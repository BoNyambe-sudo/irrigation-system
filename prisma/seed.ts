import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding...");

  // Create admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@irrigation.zm" },
    update: {},
    create: {
      email: "admin@irrigation.zm",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create customer
  const customerPassword = await bcrypt.hash("customer123", 10);
  await prisma.user.upsert({
    where: { email: "customer@test.zm" },
    update: {},
    create: {
      email: "customer@test.zm",
      name: "Test Customer",
      password: customerPassword,
      role: "USER",
    },
  });

  // Create products
  const products = [
    {
      slug: "drip-irrigation-kit-1-acre",
      name: "Drip Irrigation Kit - 1 Acre",
      type: "Drip",
      coverageAcres: 1,
      priceZMW: 15000,
      features: ["Complete kit", "Easy installation", "Water efficient"],
      images: ["https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800"],
      specs: { pressure: "1-2 bar", emitters: "2000" },
    },
    {
      slug: "sprinkler-system-2-acres",
      name: "Sprinkler System - 2 Acres",
      type: "Sprinkler",
      coverageAcres: 2,
      priceZMW: 25000,
      features: ["Full coverage", "Durable", "Adjustable"],
      images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800"],
      specs: { radius: "15m", nozzles: "12" },
    },
    {
      slug: "center-pivot-small",
      name: "Center Pivot - Small",
      type: "Pivot",
      coverageAcres: 5,
      priceZMW: 85000,
      features: ["Automated", "Large coverage", "Efficient"],
      images: ["https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800"],
      specs: { span: "50m", automation: "Yes" },
    },
    {
      slug: "micro-sprinkler-0-5-acre",
      name: "Micro Sprinkler - 0.5 Acre",
      type: "Micro-Sprinkler",
      coverageAcres: 0.5,
      priceZMW: 8500,
      features: ["Compact", "Affordable", "Easy setup"],
      images: ["https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=800"],
      specs: { flow: "2L/h", coverage: "2m" },
    },
    {
      slug: "drip-tape-3-acres",
      name: "Drip Tape System - 3 Acres",
      type: "Drip",
      coverageAcres: 3,
      priceZMW: 35000,
      features: ["Cost effective", "Long lasting", "Low pressure"],
      images: ["https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800"],
      specs: { tape: "16mm", spacing: "30cm" },
    },
    {
      slug: "solar-pump-kit",
      name: "Solar Pump Kit with Irrigation",
      type: "Solar",
      coverageAcres: 4,
      priceZMW: 120000,
      features: ["Solar powered", "Off-grid", "Sustainable"],
      images: ["https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800"],
      specs: { pump: "2HP", panels: "3000W" },
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("Seeded products");
  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
