import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorizedModRequest } from "@/lib/modAuth";
import { z } from "zod";

const querySchema = z.object({
  uuid: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      "UUID inválido"
    ),
});

/**
 * GET /api/minecraft/check?uuid=UUID
 *
 * Endpoint consumido pelo futuro mod Forge 1.20.1. Consultado quando um
 * jogador entra no servidor, para saber se a conta já está vinculada
 * a um Discord verificado.
 *
 * Requer header `x-api-key` (ver MINECRAFT_API_KEY no .env).
 */
export async function GET(req: NextRequest) {
  if (!isAuthorizedModRequest(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const uuid = req.nextUrl.searchParams.get("uuid") ?? "";
  const parsed = querySchema.safeParse({ uuid });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetro 'uuid' inválido ou ausente" },
      { status: 400 }
    );
  }

  const account = await prisma.minecraftAccount.findUnique({
    where: { minecraftUuid: parsed.data.uuid.toLowerCase() },
    include: { user: true },
  });

  if (!account) {
    return NextResponse.json({ verified: false });
  }

  return NextResponse.json({
    verified: true,
    minecraftUsername: account.minecraftUsername,
    discordId: account.user.discordId,
  });
}
