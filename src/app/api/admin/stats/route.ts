import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";

/** GET /api/admin/stats — números para os cards do dashboard administrativo. */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const [totalPlayers, verifiedAccounts, adminsCount, newsCount, settings] =
    await Promise.all([
      prisma.user.count(),
      prisma.minecraftAccount.count(),
      prisma.admin.count({ where: { active: true } }),
      prisma.news.count(),
      getSiteSettings(),
    ]);

  return NextResponse.json({
    totalPlayers,
    verifiedAccounts,
    unverifiedAccounts: totalPlayers - verifiedAccounts,
    adminsCount,
    newsCount,
    serverOnline: settings.serverOnline,
    playersOnline: null, // sem integração real de ping ainda — não inventar número
  });
}
