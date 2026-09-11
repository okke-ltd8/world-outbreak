import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import { getGuildMember } from "@/lib/discord";
import { consumeVerificationCode } from "@/lib/verificationCode";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const bodySchema = z.object({
  minecraftUsername: z
    .string()
    .min(3)
    .max(16)
    .regex(/^[a-zA-Z0-9_]+$/, "Nome de usuário Minecraft inválido"),
  code: z
    .string()
    .length(5)
    .regex(/^\d{5}$/, "O código deve conter exatamente 5 números"),
});

/**
 * POST /api/verification/complete
 * Body: { "minecraftUsername": "Steve", "code": "58321" }
 *
 * Fluxo completo de vínculo Minecraft <-> Discord:
 * 1. Usuário precisa estar autenticado.
 * 2. Usuário precisa ser membro do Discord oficial (checado no backend).
 * 3. Código precisa ser válido, não usado, não expirado e dentro do limite de tentativas.
 * 4. UUID Minecraft não pode já estar vinculado a outro Discord.
 * 5. Discord não pode já estar vinculado a outra conta Minecraft.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const ip = getClientIp(req.headers);
  const rate = checkRateLimit(
    `verify-complete:${session.user.discordId}`,
    10,
    60_000
  );
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde um instante antes de tentar novamente." },
      { status: 429 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos. Confira o nome de usuário e o código." },
      { status: 400 }
    );
  }

  // 1. Confirmar que o usuário pertence ao Discord oficial.
  let isMember = false;
  try {
    const member = await getGuildMember(session.user.discordId);
    isMember = member !== null;
  } catch {
    return NextResponse.json(
      { error: "Não foi possível confirmar seu status no Discord. Tente novamente." },
      { status: 502 }
    );
  }

  if (!isMember) {
    return NextResponse.json(
      { error: "Você precisa ser membro do Discord do World Outbreak para vincular sua conta." },
      { status: 403 }
    );
  }

  // 2. Validar e consumir o código.
  const result = await consumeVerificationCode(
    parsed.data.minecraftUsername,
    parsed.data.code
  );

  if (!result.ok) {
    const messages: Record<typeof result.reason, string> = {
      not_found: "Código inválido. Confira o código exibido no jogo.",
      expired: "Este código expirou. Entre no servidor novamente para gerar um novo.",
      used: "Este código já foi utilizado.",
      too_many_attempts:
        "Limite de tentativas atingido para este código. Entre no servidor novamente para gerar um novo.",
    };
    return NextResponse.json({ error: messages[result.reason] }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { discordId: session.user.discordId },
    include: { minecraftAccount: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  // 3. Esta conta Discord já está vinculada a uma conta Minecraft diferente?
  if (user.minecraftAccount && user.minecraftAccount.minecraftUuid !== result.minecraftUuid) {
    return NextResponse.json(
      {
        error:
          "Sua conta Discord já está vinculada a outra conta Minecraft. Contate um administrador para desvincular.",
      },
      { status: 409 }
    );
  }

  // 4. Este UUID Minecraft já está vinculado a outro Discord?
  const existingLink = await prisma.minecraftAccount.findUnique({
    where: { minecraftUuid: result.minecraftUuid },
  });
  if (existingLink && existingLink.userId !== user.id) {
    return NextResponse.json(
      {
        error:
          "Esta conta Minecraft já está vinculada a outra conta Discord. Contate um administrador.",
      },
      { status: 409 }
    );
  }

  const account = await prisma.minecraftAccount.upsert({
    where: { userId: user.id },
    update: {
      minecraftUuid: result.minecraftUuid,
      minecraftUsername: result.minecraftUsername,
      verifiedAt: new Date(),
    },
    create: {
      userId: user.id,
      minecraftUuid: result.minecraftUuid,
      minecraftUsername: result.minecraftUsername,
    },
  });

  return NextResponse.json({
    verified: true,
    minecraftUsername: account.minecraftUsername,
  });
}
