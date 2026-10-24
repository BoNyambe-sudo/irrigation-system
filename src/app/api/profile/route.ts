import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ name: user.name, email: user.email, image: user.image });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, image, currentPassword, newPassword } = await req.json();
  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: any = {};
  if (name !== undefined) data.name = name;
  if (image !== undefined) data.image = image;

  if (newPassword) {
    if (!user.password) return NextResponse.json({ error: "No password set" }, { status: 400 });
    const valid = await bcrypt.compare(currentPassword || "", user.password);
    if (!valid) return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });
    data.password = await bcrypt.hash(newPassword, 10);
  }

  const updated = await prisma.user.update({ where: { id: user.id }, data });
  return NextResponse.json({ ok: true, name: updated.name, image: updated.image });
}