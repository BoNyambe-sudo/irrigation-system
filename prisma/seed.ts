import "dotenv/config";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding...");

  // Create admin
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD as string,
    10,
  );
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL as string },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL as string,
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create customer
  const customerPassword = await bcrypt.hash(
    process.env.CUSTOMER_PASSWORD as string,
    10,
  );
  await prisma.user.upsert({
    where: { email: process.env.CUSTOMER_EMAIL as string },
    update: {},
    create: {
      email: process.env.CUSTOMER_EMAIL as string,
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
      images: [
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      ],
      specs: { pressure: "1-2 bar", emitters: "2000" },
    },
    {
      slug: "sprinkler-system-2-acres",
      name: "Sprinkler System - 2 Acres",
      type: "Sprinkler",
      coverageAcres: 2,
      priceZMW: 25000,
      features: ["Full coverage", "Durable", "Adjustable"],
      images: [
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
      ],
      specs: { radius: "15m", nozzles: "12" },
    },
    {
      slug: "center-pivot-small",
      name: "Center Pivot - Small",
      type: "Pivot",
      coverageAcres: 5,
      priceZMW: 85000,
      features: ["Automated", "Large coverage", "Efficient"],
      images: [
        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
      ],
      specs: { span: "50m", automation: "Yes" },
    },
    {
      slug: "micro-sprinkler-0-5-acre",
      name: "Micro Sprinkler - 0.5 Acre",
      type: "Micro-Sprinkler",
      coverageAcres: 0.5,
      priceZMW: 8500,
      features: ["Compact", "Affordable", "Easy setup"],
      images: [
        "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=800",
      ],
      specs: { flow: "2L/h", coverage: "2m" },
    },
    {
      slug: "drip-tape-3-acres",
      name: "Drip Tape System - 3 Acres",
      type: "Drip",
      coverageAcres: 3,
      priceZMW: 35000,
      features: ["Cost effective", "Long lasting", "Low pressure"],
      images: [
        "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800",
      ],
      specs: { tape: "16mm", spacing: "30cm" },
    },
    {
      slug: "solar-pump-kit",
      name: "Solar Pump Kit with Irrigation",
      type: "Solar",
      coverageAcres: 4,
      priceZMW: 120000,
      features: ["Solar powered", "Off-grid", "Sustainable"],
      images: [
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
      ],
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

  // Seed 15 demo orders around Lusaka for the admin dashboard/map.
  const allProducts = await prisma.product.findMany();
  const demoCustomers = [
    {
      name: "John Mwale",
      phone: "+260971111111",
      whatsapp: "+260971111111",
      province: "Lusaka",
    },
    {
      name: "Mary Banda",
      phone: "+260972222222",
      whatsapp: "+260972222222",
      province: "Lusaka",
    },
    {
      name: "Patrick Sichilongo",
      phone: "+260973333333",
      whatsapp: "+260973333333",
      province: "Copperbelt",
    },
    {
      name: "Grace Phiri",
      phone: "+260974444444",
      whatsapp: "+260974444444",
      province: "Lusaka",
    },
    {
      name: "Daniel Chanda",
      phone: "+260975555555",
      whatsapp: "+260975555555",
      province: "Lusaka",
    },
    {
      name: "Ruth Mumba",
      phone: "+260976666666",
      whatsapp: "+260976666666",
      province: "Central",
    },
    {
      name: "Samuel Lungu",
      phone: "+260977777777",
      whatsapp: "+260977777777",
      province: "Lusaka",
    },
    {
      name: "Agnes Mwila",
      phone: "+260978888888",
      whatsapp: "+260978888888",
      province: "Lusaka",
    },
    {
      name: "Paul Kunda",
      phone: "+260979999999",
      whatsapp: "+260979999999",
      province: "Eastern",
    },
    {
      name: "Catherine Moyo",
      phone: "+2609611111111",
      whatsapp: "+2609611111111",
      province: "Lusaka",
    },
    {
      name: "Francis Mubanga",
      phone: "+2609622222222",
      whatsapp: "+2609622222222",
      province: "Lusaka",
    },
    {
      name: "Lillian Mulenga",
      phone: "+2609633333333",
      whatsapp: "+2609633333333",
      province: "Lusaka",
    },
    {
      name: "Peter Tembo",
      phone: "+2609644444444",
      whatsapp: "+2609644444444",
      province: "Copperbelt",
    },
    {
      name: "Susan Hachipu",
      phone: "+2609655555555",
      whatsapp: "+2609655555555",
      province: "Lusaka",
    },
    {
      name: "Andrew Zulu",
      phone: "+2609666666666",
      whatsapp: "+2609666666666",
      province: "Lusaka",
    },
  ];

  const statuses: (
    "PENDING" | "REVIEWING" | "QUOTED" | "APPROVED" | "INSTALLED" | "COMPLETED"
  )[] = [
    "PENDING",
    "REVIEWING",
    "QUOTED",
    "APPROVED",
    "INSTALLED",
    "COMPLETED",
  ];
  const paymentMethods: ("MOMO" | "AIRTEL" | "CARD" | "CASH")[] = [
    "MOMO",
    "AIRTEL",
    "CARD",
    "CASH",
  ];
  const paymentStatuses: ("PENDING" | "PAID" | "FAILED")[] = [
    "PENDING",
    "PAID",
    "PAID",
  ];

  // Deterministic jitter around Lusaka centre (-15.4067, 28.2871)
  const lusakaLat = (i: number) =>
    -15.4067 + ((i % 5) - 2) * 0.05 + ((i * 0.007) % 0.03);
  const lusakaLng = (i: number) =>
    28.2871 + ((i % 5) - 2) * 0.05 + ((i * 0.009) % 0.03);

  for (let i = 0; i < demoCustomers.length; i++) {
    const c = demoCustomers[i];
    const product = allProducts[i % allProducts.length];
    const farmSize = Math.round((0.5 + (i % 4) * 0.5) * 10) / 10;
    const pricePerAcre =
      product.priceZMW / Math.max(product.coverageAcres, 0.1);
    const amount = Math.round(pricePerAcre * farmSize);

    const existingCustomer = await prisma.customer.findFirst({
      where: { phone: c.phone },
    });
    const customer = existingCustomer
      ? existingCustomer
      : await prisma.customer.create({ data: c });

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        productId: product.id,
        farmSize,
        waterSource: ["Borehole", "River", "Dam"][i % 3],
        cropType: ["Maize", "Vegetables", "Wheat", "Groundnuts"][i % 4],
        lat: lusakaLat(i),
        lng: lusakaLng(i),
        accuracy: 12 + (i % 5),
        address: `Plot ${100 + i}, Chilanga area, ${c.province}`,
        province: c.province,
        amount,
        paymentMethod: paymentMethods[i % paymentMethods.length],
        paymentStatus: paymentStatuses[i % paymentStatuses.length],
        status: statuses[i % statuses.length],
        sitePhotos: [],
      },
    });

    await prisma.orderTimeline.create({
      data: {
        orderId: order.id,
        status: order.status,
        note: `Order created during seed. Status: ${order.status}.`,
      },
    });
  }

  console.log("Seeded 15 demo orders");
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
