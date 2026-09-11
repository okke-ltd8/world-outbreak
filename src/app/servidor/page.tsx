import { getSiteSettings } from "@/lib/settings";
import { Card } from "@/components/Card";
import { ServerStatus } from "@/components/ServerStatus";

export const dynamic = "force-dynamic";

export default async function ServidorPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 lg:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-outbreak-warn">Dados técnicos</p>
      <h1 className="mt-2 font-display text-4xl text-white">{settings.serverName.toUpperCase()}</h1>
      <p className="mt-3 max-w-2xl text-outbreak-ash">{settings.serverDescription}</p>

      <div className="mt-8 rounded-sm border border-outbreak-line bg-outbreak-panel/60 px-5 py-4">
        <ServerStatus />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-outbreak-ash">Plataforma</p>
          <p className="mt-1 text-white">Minecraft Java Edition</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-outbreak-ash">Versão</p>
          <p className="mt-1 font-mono text-white">{settings.serverVersion}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-outbreak-ash">Modpack</p>
          <p className="mt-1 text-white">
            {settings.modpackUrl ? (
              <a href={settings.modpackUrl} target="_blank" rel="noreferrer" className="text-outbreak-bloodBright hover:underline">
                {settings.modpackName}
              </a>
            ) : (
              settings.modpackName
            )}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-outbreak-ash">Tipo</p>
          <p className="mt-1 text-white">Apocalipse / Survival</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-outbreak-ash">Endereço (IP)</p>
          <p className="mt-1 font-mono text-white">{settings.serverIp}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-outbreak-ash">Porta</p>
          <p className="mt-1 font-mono text-white">{settings.serverPort}</p>
        </Card>
      </div>
    </div>
  );
}
