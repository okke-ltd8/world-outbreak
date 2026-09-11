import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";

/** GET /api/admin/logs — histórico de ações administrativas, mais recentes primeiro. */
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const take = Math.min(Number(req.nextUrl.searchParams.get("take") ?? 100), 500);

  const logs = await prisma.adminLog.findMany({
    orderBy: { createdAt: "desc" },
    take,
    include: { admin: { select: { discordUsername: true, discordAvatar: true } } },
  });

  return NextResponse.json(logs);
}
