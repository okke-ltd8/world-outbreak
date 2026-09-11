import { NextResponse } from "next/server";
import { getSession } from "@/lib/authGuard";
import { getGuildMember } from "@/lib/discord";

/**
 * GET /api/discord/member
 *
 * Verifica se o usuário autenticado (sessão atual) é membro do servidor
 * Discord oficial do World Outbreak. Usa o Discord ID como identificador,
 * nunca o username.
 */
export async function GET() {
  const session = await getSession();

  if (!session?.user?.discordId) {
    return NextResponse.json(
      { authenticated: false, isMember: false },
      { status: 401 }
    );
  }

  try {
    const member = await getGuildMember(session.user.discordId);

    return NextResponse.json({
      authenticated: true,
      isMember: member !== null,
    });
  } catch (error) {
    console.error("Erro ao verificar membro do Discord:", error);
    return NextResponse.json(
      {
        authenticated: true,
        isMember: false,
        error: "Não foi possível verificar seu status no Discord agora. Tente novamente em instantes.",
      },
      { status: 502 }
    );
  }
}
