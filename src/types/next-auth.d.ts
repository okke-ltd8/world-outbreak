import type { AdminRole } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      discordId: string;
      discordUsername: string;
      discordAvatar: string | null;
      isAdmin: boolean;
      adminRole: AdminRole | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId?: string;
    discordUsername?: string;
    discordAvatar?: string | null;
  }
}
