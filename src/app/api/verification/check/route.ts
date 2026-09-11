import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/authGuard";
import { peekPendingCode } from "@/lib/verificationCode";

const bodySchema = z.object({
  minecraftUsername: z
    .string()
    .min(3)
    .max(16)
    .regex(/^[a-zA-Z0-9_]+$/, "Nome de usuário Minecraft inválido"),
});

/**
 * POST /api/verification/check
 * Body: { "minecraftUsername": "Steve" }
 *
 * Verificação somente leitura: informa se existe um código pendente para
 * aquele nome (e se está expirado / esgotado), sem consumir tentativas.
 * Usado pelo formulário para dar feedback antes do envio final em
 * /api/verification/complete.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Nome de usuário Minecraft inválido" },
      { status: 400 }
    );
  }

  const status = await peekPendingCode(parsed.data.minecraftUsername);
  return NextResponse.json(status);
}
