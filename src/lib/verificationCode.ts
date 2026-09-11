import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";

const CODE_LENGTH = 5;
const CODE_TTL_MINUTES = 15;
const MAX_ATTEMPTS = 5;

/** Gera um código numérico de 5 dígitos criptograficamente seguro (00000-99999). */
function generateSecureCode(): string {
  const value = randomInt(0, 10 ** CODE_LENGTH);
  return value.toString().padStart(CODE_LENGTH, "0");
}

/**
 * Cria (ou reaproveita) um código de verificação de uso único para um UUID Minecraft.
 * Usado pelo endpoint que o mod Forge chamará (`/api/minecraft/register-code`).
 *
 * Qualquer código anterior ainda válido e não usado para o mesmo UUID é invalidado,
 * garantindo que exista no máximo um código ativo por jogador.
 */
export async function createVerificationCode(
  minecraftUuid: string,
  minecraftUsername: string
) {
  await prisma.verificationCode.updateMany({
    where: { minecraftUuid, used: false },
    data: { used: true }, // invalida códigos antigos não usados
  });

  const code = generateSecureCode();
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

  return prisma.verificationCode.create({
    data: {
      minecraftUuid,
      minecraftUsername,
      code,
      expiresAt,
      maxAttempts: MAX_ATTEMPTS,
    },
  });
}

export type VerifyCodeResult =
  | { ok: true; minecraftUuid: string; minecraftUsername: string }
  | { ok: false; reason: "not_found" | "expired" | "used" | "too_many_attempts" };

/**
 * Valida um código informado pelo usuário no site.
 * Incrementa tentativas em caso de erro e respeita o limite máximo.
 */
export async function consumeVerificationCode(
  minecraftUsername: string,
  code: string
): Promise<VerifyCodeResult> {
  const entry = await prisma.verificationCode.findFirst({
    where: {
      minecraftUsername: { equals: minecraftUsername },
      used: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!entry) return { ok: false, reason: "not_found" };

  if (entry.attempts >= entry.maxAttempts) {
    return { ok: false, reason: "too_many_attempts" };
  }

  if (entry.expiresAt.getTime() < Date.now()) {
    return { ok: false, reason: "expired" };
  }

  if (entry.code !== code) {
    await prisma.verificationCode.update({
      where: { id: entry.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, reason: "not_found" };
  }

  await prisma.verificationCode.update({
    where: { id: entry.id },
    data: { used: true },
  });

  return {
    ok: true,
    minecraftUuid: entry.minecraftUuid,
    minecraftUsername: entry.minecraftUsername,
  };
}

/**
 * Validação "somente leitura" usada pelo endpoint /api/verification/check:
 * confere se existe um código pendente válido para o username, sem consumi-lo
 * nem comparar o valor do código (usado para dar feedback de estado antes do envio final).
 */
export async function peekPendingCode(minecraftUsername: string) {
  const entry = await prisma.verificationCode.findFirst({
    where: { minecraftUsername: { equals: minecraftUsername }, used: false },
    orderBy: { createdAt: "desc" },
  });

  if (!entry) return { exists: false as const };

  const expired = entry.expiresAt.getTime() < Date.now();
  const attemptsExceeded = entry.attempts >= entry.maxAttempts;

  return {
    exists: true as const,
    expired,
    attemptsExceeded,
    attemptsRemaining: Math.max(0, entry.maxAttempts - entry.attempts),
    expiresAt: entry.expiresAt,
  };
}
