import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAdminAction, getCurrentUserId } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/rateLimit";

/**
 * POST /api/admin/players/[id]/unlink
 *
 * Desvincula a conta Minecraft do usuário (Discord) informado.
 * `id` é o `User.id` interno (não o discordId).
 *
 * A confirmação ("Tem certeza que deseja desvincular Steve de @Joao?")
 * acontece no frontend antes de chamar este endpoint; o backend apenas
 * executa e registra a ação no AdminLog.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { minecraftAccount: true },
  });

  if (!user || !user.minecraftAccount) {
    return NextResponse.json(
      { error: "Este jogador não possui uma conta Minecraft vinculada." },
      { status: 404 }
    );
  }

  const minecraftUsername = user.minecraftAccount.minecraftUsername;

  await prisma.minecraftAccount.delete({ where: { userId: user.id } });

  await logAdminAction({
    adminUserId: await getCurrentUserId(),
    action: "Admin desvinculou conta Minecraft",
    details: `Desvinculou ${minecraftUsername} de @${user.discordUsername} (discordId: ${user.discordId})`,
    ipAddress: getClientIp(req.headers),
  });

  return NextResponse.json({ success: true });
}
