import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, logAdminAction, getCurrentUserId } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/rateLimit";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const rules = await prisma.rule.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  return NextResponse.json(rules);
}

const createSchema = z.object({
  category: z.string().min(1).max(40),
  title: z.string().min(1).max(150),
  content: z.string().min(1),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const rule = await prisma.rule.create({ data: parsed.data });

  await logAdminAction({
    adminUserId: await getCurrentUserId(),
    action: "Admin criou regra",
    details: `"${rule.title}" (${rule.category})`,
    ipAddress: getClientIp(req.headers),
  });

  return NextResponse.json(rule, { status: 201 });
}
