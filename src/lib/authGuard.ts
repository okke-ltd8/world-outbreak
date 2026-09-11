import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";
import type { AdminRole } from "@prisma/client";

/** Retorna a sessão atual (ou null) no lado do servidor. */
export async function getSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

/**
 * Garante que a requisição vem de um administrador ativo.
 * Consulta o banco diretamente (não confia apenas no token de sessão),
 * como camada extra contra sessões antigas de um admin que acabou de ser desativado.
 *
 * Retorna o registro do Admin se autorizado, ou `null` se não autorizado.
 */
export async function requireAdmin(minRole?: AdminRole) {
  const session = await getSession();
  if (!session?.user?.discordId) return null;

  const admin = await prisma.admin.findUnique({
    where: { discordId: session.user.discordId },
  });

  if (!admin || !admin.active) return null;

  if (minRole === "SUPER_ADMIN" && admin.role !== "SUPER_ADMIN") return null;

  return admin;
}

/** Busca o User (perfil da aplicação) correspondente à sessão atual. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user?.discordId) return null;

  return prisma.user.findUnique({
    where: { discordId: session.user.discordId },
    include: { minecraftAccount: true },
  });
}

/** Busca o `User.id` da sessão atual, para uso em AdminLog.adminId. Lança erro se ausente. */
export async function getCurrentUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.user?.discordId) {
    throw new Error("Sessão ausente ao registrar log administrativo");
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: { discordId: session.user.discordId },
  });
  return user.id;
}

interface LogParams {
  adminUserId: string;
  action: string;
  details?: string;
  ipAddress?: string | null;
}

/** Registra uma ação administrativa no AdminLog. Nunca deve receber secrets/tokens. */
export async function logAdminAction({
  adminUserId,
  action,
  details,
  ipAddress,
}: LogParams) {
  await prisma.adminLog.create({
    data: {
      adminId: adminUserId,
      action,
      details,
      ipAddress: ipAddress ?? undefined,
    },
  });
}
