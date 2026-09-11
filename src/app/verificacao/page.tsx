import { redirect } from "next/navigation";
import { getSession } from "@/lib/authGuard";
import { getSiteSettings } from "@/lib/settings";
import { VerificationCard } from "@/components/VerificationCard";

export const dynamic = "force-dynamic";

export default async function VerificacaoPage() {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=/verificacao");

  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-xl px-4 py-14 lg:px-6">
      <h1 className="text-center font-display text-3xl text-white">Verificação de conta</h1>
      <p className="mt-2 text-center text-sm text-outbreak-ash">
        Vincule sua conta Minecraft à sua conta Discord para liberar o acesso ao servidor.
      </p>
      <div className="mt-8">
        <VerificationCard discordInvite={settings.discordInvite} />
      </div>
    </div>
  );
}
