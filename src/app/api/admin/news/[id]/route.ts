import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, logAdminAction, getCurrentUserId } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/rateLimit";

const patchSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  content: z.string().min(1).optional(),
  imageUrl: z.string().url().or(z.literal("")).optional(),
  published: z.boolean().optional(),
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

  const updated = await prisma.news.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      imageUrl: parsed.data.imageUrl === "" ? null : parsed.data.imageUrl,
    },
  });

  await logAdminAction({
    adminUserId: await getCurrentUserId(),
    action:
      parsed.data.published === true
        ? "Admin publicou notícia"
        : parsed.data.published === false
        ? "Admin despublicou notícia"
        : "Admin editou notícia",
    details: `"${updated.title}" (${updated.slug})`,
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

  const removed = await prisma.news.delete({ where: { id: params.id } });

  await logAdminAction({
    adminUserId: await getCurrentUserId(),
    action: "Admin excluiu notícia",
    details: `"${removed.title}" (${removed.slug})`,
    ipAddress: getClientIp(req.headers),
  });

  return NextResponse.json({ success: true });
}
