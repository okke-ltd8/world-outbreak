import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, logAdminAction, getCurrentUserId } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/rateLimit";

const patchSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]).optional(),
  active: z.boolean().optional(),
});

/**
 * PATCH /api/admin/admins/[id]
 * Somente SUPER_ADMIN. Permite editar nome, cargo, ou ativar/desativar um administrador.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin("SUPER_ADMIN");
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (params.id === admin.id && parsed.data.active === false) {
    return NextResponse.json(
      { error: "Você não pode desativar sua própria conta de administrador." },
      { status: 400 }
    );
  }

  const updated = await prisma.admin.update({
    where: { id: params.id },
    data: parsed.data,
  });

  await logAdminAction({
    adminUserId: await getCurrentUserId(),
    action: "Admin atualizou um administrador",
    details: `Discord ID: ${updated.discordId}, alterações: ${Object.keys(parsed.data).join(", ")}`,
    ipAddress: getClientIp(req.headers),
  });

  return NextResponse.json(updated);
}

/**
 * DELETE /api/admin/admins/[id]
 * Somente SUPER_ADMIN. Remove um administrador definitivamente.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin("SUPER_ADMIN");
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  if (params.id === admin.id) {
    return NextResponse.json(
      { error: "Você não pode remover sua própria conta de administrador." },
      { status: 400 }
    );
  }

  const removed = await prisma.admin.delete({ where: { id: params.id } });

  await logAdminAction({
    adminUserId: await getCurrentUserId(),
    action: "Admin removeu um administrador",
    details: `Discord ID: ${removed.discordId}`,
    ipAddress: getClientIp(req.headers),
  });

  return NextResponse.json({ success: true });
}
