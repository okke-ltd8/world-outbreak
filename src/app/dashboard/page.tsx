import { redirect } from "next/navigation";
import { getSession, getCurrentUser } from "@/lib/authGuard";
import { getGuildMember } from "@/lib/discord";
import { Card } from "@/components/Card";
import { UserAvatar } from "@/components/UserAvatar";
import { MinecraftAccount } from "@/components/MinecraftAccount";
import { buttonClasses } from "@/components/Button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  let isMember = false;
  let discordError = false;
  try {
    const member = await getGuildMember(session.user.discordId);
    isMember = member !== null;
  } catch {
    discordError = true;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <div className="flex items-center gap-4">
        <UserAvatar
          discordId={session.user.discordId}
          avatarHash={session.user.discordAvatar}
          username={session.user.discordUsername}
          size={56}
        />
        <div>
          <h1 className="font-display text-2xl text-white">{session.user.discordUsername}</h1>
          <p className="text-sm text-outbreak-ash">Discord ID: {session.user.discordId}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display text-lg text-white">Discord</h3>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-outbreak-militaryBright">✅ Conectado</p>
            {discordError ? (
              <p className="text-outbreak-ash">Não foi possível confirmar seu status de membro agora.</p>
            ) : isMember ? (
              <p className="text-outbreak-militaryBright">✅ Membro do World Outbreak</p>
            ) : (
              <div>
                <p className="text-outbreak-ash">❌ Você ainda não é membro do Discord oficial.</p>
                <Link href="/verificacao" className={`${buttonClasses("secondary")} mt-3 inline-flex`}>
                  Resolver agora
                </Link>
              </div>
            )}
          </div>
        </Card>

        <MinecraftAccount
          linked={Boolean(user.minecraftAccount)}
          username={user.minecraftAccount?.minecraftUsername}
          verifiedAt={user.minecraftAccount?.verifiedAt}
        />
      </div>
    </div>
  );
}
