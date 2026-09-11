import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type UserWithMinecraft = Prisma.UserGetPayload<{ include: { minecraftAccount: true } }>;

/**
 * GET /api/admin/players?q=busca
 *
 * Lista jogadores cadastrados (Discord + vínculo Minecraft, se existir).
 * `q` filtra por username/uuid do Minecraft ou username/id do Discord.
 */
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const q = req.nextUrl.searchParams.get("q")?.trim();

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { discordUsername: { contains: q } },
            { discordId: { contains: q } },
            { minecraftAccount: { minecraftUsername: { contains: q } } },
            { minecraftAccount: { minecraftUuid: { contains: q } } },
          ],
        }
      : undefined,
    include: { minecraftAccount: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json(
    users.map((u: UserWithMinecraft) => ({
      id: u.id,
      discordId: u.discordId,
      discordUsername: u.discordUsername,
      discordAvatar: u.discordAvatar,
      minecraft: u.minecraftAccount
        ? {
            username: u.minecraftAccount.minecraftUsername,
            uuid: u.minecraftAccount.minecraftUuid,
            verifiedAt: u.minecraftAccount.verifiedAt,
          }
        : null,
      createdAt: u.createdAt,
    }))
  );
}
