import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "@/lib/prisma";

/**
 * Configuração central do NextAuth (Discord OAuth2).
 *
 * Regras importantes:
 * - Nunca pedimos ou armazenamos senha do Discord: o OAuth2 cuida disso.
 * - O Discord ID é o identificador principal do usuário no nosso banco
 *   (não o username, que pode mudar).
 * - A verificação de "é administrador?" é feita consultando a tabela `Admin`
 *   no backend a cada sessão — nunca confiamos em nada vindo do cliente.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: { params: { scope: "identify email" } },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "discord" || !profile) return false;

      const discordProfile = profile as {
        id: string;
        username: string;
        avatar: string | null;
        email?: string;
      };

      // Upsert do usuário pelo Discord ID (identificador principal).
      await prisma.user.upsert({
        where: { discordId: discordProfile.id },
        update: {
          discordUsername: discordProfile.username,
          discordAvatar: discordProfile.avatar,
          discordEmail: discordProfile.email ?? null,
        },
        create: {
          discordId: discordProfile.id,
          discordUsername: discordProfile.username,
          discordAvatar: discordProfile.avatar,
          discordEmail: discordProfile.email ?? null,
        },
      });

      return true;
    },

    async jwt({ token, profile }) {
      if (profile) {
        const discordProfile = profile as {
          id: string;
          username: string;
          avatar: string | null;
        };
        token.discordId = discordProfile.id;
        token.discordUsername = discordProfile.username;
        token.discordAvatar = discordProfile.avatar;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.discordId = token.discordId as string;
        session.user.discordUsername = token.discordUsername as string;
        session.user.discordAvatar = token.discordAvatar as string | null;

        // Autorização de admin sempre checada no backend, nunca confiada do token/cliente.
        const admin = await prisma.admin.findUnique({
          where: { discordId: token.discordId as string },
        });
        session.user.isAdmin = Boolean(admin?.active);
        session.user.adminRole = admin?.active ? admin.role : null;
      }
      return session;
    },
  },
};
