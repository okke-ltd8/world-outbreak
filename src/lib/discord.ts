/**
 * Helpers para comunicação server-side com a API do Discord.
 *
 * IMPORTANTE: DISCORD_BOT_TOKEN nunca deve ser exposto ao frontend.
 * Este arquivo só deve ser importado por código que roda no servidor
 * (Route Handlers, Server Components, funções de callback do NextAuth).
 */

const DISCORD_API = "https://discord.com/api/v10";

export interface DiscordGuildMember {
  user?: {
    id: string;
    username: string;
    avatar: string | null;
  };
  nick: string | null;
  roles: string[];
  joined_at: string;
}

/**
 * Verifica se um usuário (pelo Discord ID) é membro do servidor (guild) oficial.
 * Usa o Bot Token, nunca o token OAuth2 do próprio usuário, pois o bot
 * precisa estar no servidor para consultar a lista de membros com segurança
 * e de forma confiável (o escopo `guilds.members.read` do usuário é frágil
 * e pode não estar disponível).
 *
 * Retorna o membro se pertencer ao servidor, ou `null` caso contrário.
 */
export async function getGuildMember(
  discordUserId: string
): Promise<DiscordGuildMember | null> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !botToken) {
    throw new Error(
      "DISCORD_GUILD_ID ou DISCORD_BOT_TOKEN não configurados no .env"
    );
  }

  const res = await fetch(
    `${DISCORD_API}/guilds/${guildId}/members/${discordUserId}`,
    {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      // Nunca cachear: o status de membro pode mudar a qualquer momento.
      cache: "no-store",
    }
  );

  if (res.status === 404) {
    // Usuário não é membro do servidor
    return null;
  }

  if (!res.ok) {
    // Não assumir "não é membro" em caso de erro de infraestrutura;
    // propaga o erro para a camada de chamada decidir como tratar.
    throw new Error(
      `Falha ao consultar membro do Discord (status ${res.status})`
    );
  }

  return (await res.json()) as DiscordGuildMember;
}
