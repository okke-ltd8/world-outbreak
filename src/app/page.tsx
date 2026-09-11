import { Hero } from "@/components/Hero";
import { Card } from "@/components/Card";
import { buttonClasses } from "@/components/Button";
import { getSiteSettings } from "@/lib/settings";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <Hero title={settings.heroTitle} subtitle={settings.heroSubtitle} discordInvite={settings.discordInvite} />

      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-outbreak-warn">O mundo depois</p>
            <h2 className="mt-2 font-display text-3xl text-white">Sobre o servidor</h2>
            <p className="mt-4 text-outbreak-fog">{settings.serverDescription}</p>
            <p className="mt-3 text-outbreak-ash">
              Cidades abandonadas, recursos escassos e infectados em todo canto. No World
              Outbreak, sobreviver sozinho é possível — prosperar exige aliados. Organize-se
              em clãs, fortifique posições e decida em quem confiar antes que seja tarde.
            </p>
          </div>
          <Card className="p-6">
            <ul className="space-y-3 text-sm text-outbreak-fog">
              <li className="flex justify-between border-b border-outbreak-line pb-3">
                <span className="text-outbreak-ash">Versão</span>
                <span className="font-mono">{settings.serverVersion}</span>
              </li>
              <li className="flex justify-between border-b border-outbreak-line pb-3">
                <span className="text-outbreak-ash">Modpack</span>
                <span className="font-mono">{settings.modpackName}</span>
              </li>
              <li className="flex justify-between border-b border-outbreak-line pb-3">
                <span className="text-outbreak-ash">Tipo</span>
                <span className="font-mono">Apocalipse / Survival</span>
              </li>
              <li className="flex justify-between">
                <span className="text-outbreak-ash">Limite de jogadores</span>
                <span className="font-mono">{settings.maxPlayers}</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="border-t border-outbreak-line bg-outbreak-panel/40">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-outbreak-warn">Antes de entrar</p>
          <h2 className="mt-2 font-display text-3xl text-white">Como jogar</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                n: "1",
                title: "Instale o Minecraft Java",
                text: `Você precisa possuir o Minecraft Java Edition, versão ${settings.serverVersion}.`,
              },
              {
                n: "2",
                title: "Instale o modpack",
                text: `Baixe e instale o modpack ${settings.modpackName} antes de se conectar ao servidor.`,
              },
              {
                n: "3",
                title: "Verifique sua conta",
                text: "Vincule seu Minecraft ao seu Discord para liberar o acesso completo.",
              },
            ].map((step) => (
              <Card key={step.n} className="p-6">
                <span className="font-display text-3xl text-outbreak-blood">{step.n}</span>
                <h3 className="mt-3 font-medium text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-outbreak-ash">{step.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-8">
            <h2 className="font-display text-2xl text-white">Sistema de verificação</h2>
            <p className="mt-3 text-sm text-outbreak-ash">
              Para proteger a comunidade, todo jogador precisa vincular sua conta Minecraft
              à sua conta Discord. O processo é rápido: entre no servidor, receba um código
              de 5 dígitos, e informe-o aqui no site.
            </p>
            <Link href="/verificacao" className={`${buttonClasses("secondary")} mt-5 inline-flex`}>
              Fazer verificação
            </Link>
          </Card>
          <Card className="p-8">
            <h2 className="font-display text-2xl text-white">Clãs</h2>
            <p className="mt-3 text-sm text-outbreak-ash">
              Sozinho você sobrevive um pouco mais. Em grupo, você domina território. O
              World Outbreak conta com um sistema de clãs para quem quiser disputar poder
              nas ruínas do mundo.
            </p>
            <Link href="/ranking" className={`${buttonClasses("secondary")} mt-5 inline-flex`}>
              Ver ranking
            </Link>
          </Card>
        </div>
      </section>

      <section className="border-t border-outbreak-line bg-outbreak-panel/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center lg:px-6">
          <h2 className="font-display text-3xl text-white">Junte-se à comunidade</h2>
          <p className="max-w-xl text-outbreak-ash">
            Notícias, suporte, eventos e a vinculação da sua conta acontecem no nosso
            Discord. Entre agora e prepare-se para o surto.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <a href={settings.discordInvite} target="_blank" rel="noreferrer" className={buttonClasses("primary")}>
              Entrar no Discord
            </a>
            <Link href="/servidor" className={buttonClasses("secondary")}>
              Ver dados do servidor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
