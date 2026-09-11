import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, logAdminAction, getCurrentUserId } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/rateLimit";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const admins = await prisma.admin.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(admins);
}

const createSchema = z.object({
  discordId: z.string().regex(/^\d{17,20}$/, "Discord ID inválido"),
  name: z.string().min(1).max(60),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]).default("ADMIN"),
});

/**
 * POST /api/admin/admins
 *
 * Adiciona um novo administrador pelo Discord ID.
 * Somente SUPER_ADMIN pode gerenciar administradores.
 */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin("SUPER_ADMIN");
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.admin.findUnique({
    where: { discordId: parsed.data.discordId },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Já existe um administrador com este Discord ID." },
      { status: 409 }
    );
  }

  const created = await prisma.admin.create({ data: parsed.data });

  await logAdminAction({
    adminUserId: await getCurrentUserId(),
    action: "Admin adicionou novo administrador",
    details: `Discord ID: ${created.discordId}, cargo: ${created.role}`,
    ipAddress: getClientIp(req.headers),
  });

  return NextResponse.json(created, { status: 201 });
}
