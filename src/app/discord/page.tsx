import { getSiteSettings } from "@/lib/settings";
import { buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";

export const dynamic = "force-dynamic";

export default async function DiscordPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center lg:px-6">
      <Card className="w-full p-10">
        <span className="text-4xl">☣</span>
        <h1 className="mt-4 font-display text-3xl text-white">Faça parte da comunidade World Outbreak</h1>
        <p className="mt-3 text-outbreak-ash">
          Notícias em primeira mão, suporte, eventos e a vinculação da sua conta Minecraft
          acontecem no nosso servidor Discord.
        </p>
        <a href={settings.discordInvite} target="_blank" rel="noreferrer" className={`${buttonClasses("primary")} mt-6 inline-flex`}>
          Entrar no Discord
        </a>
      </Card>
    </div>
  );
}
