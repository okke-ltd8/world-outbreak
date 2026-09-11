import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, logAdminAction, getCurrentUserId } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/rateLimit";

const patchSchema = z.object({
  category: z.string().min(1).max(40).optional(),
  title: z.string().min(1).max(150).optional(),
  content: z.string().min(1).optional(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await prisma.rule.update({ where: { id: params.id }, data: parsed.data });

  await logAdminAction({
    adminUserId: await getCurrentUserId(),
    action: "Admin editou regra",
    details: `"${updated.title}" (${updated.category})`,
    ipAddress: getClientIp(req.headers),
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const removed = await prisma.rule.delete({ where: { id: params.id } });

  await logAdminAction({
    adminUserId: await getCurrentUserId(),
    action: "Admin excluiu regra",
    details: `"${removed.title}" (${removed.category})`,
    ipAddress: getClientIp(req.headers),
  });

  return NextResponse.json({ success: true });
}
