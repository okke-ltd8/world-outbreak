import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthorizedModRequest } from "@/lib/modAuth";
import { createVerificationCode } from "@/lib/verificationCode";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const bodySchema = z.object({
  uuid: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      "UUID inválido"
    ),
  username: z
    .string()
    .min(3)
    .max(16)
    .regex(/^[a-zA-Z0-9_]+$/, "Nome de usuário Minecraft inválido"),
});

/**
 * POST /api/minecraft/register-code
 * Body: { "uuid": "...", "username": "..." }
 *
 * Chamado pelo mod Forge quando detecta um jogador não verificado.
 * Gera (ou renova) um código de 5 dígitos de uso único, associado ao UUID,
 * que o jogador deverá informar no site.
 *
 * Requer header `x-api-key` (ver MINECRAFT_API_KEY no .env).
 */
export async function POST(req: NextRequest) {
  if (!isAuthorizedModRequest(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const ip = getClientIp(req.headers);
  const rate = checkRateLimit(`register-code:${ip}`, 30, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em instantes." },
      { status: 429 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const uuid = parsed.data.uuid.toLowerCase();

  const entry = await createVerificationCode(uuid, parsed.data.username);

  return NextResponse.json({
    code: entry.code,
    expiresAt: entry.expiresAt,
  });
}
