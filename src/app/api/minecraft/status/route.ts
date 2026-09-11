import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/settings";

/**
 * GET /api/minecraft/status
 *
 * Retorna o status público do servidor. Os campos `online` e `playersOnline`
 * só existirão de verdade quando houver integração com o servidor Minecraft
 * (ex: consulta via protocolo Server List Ping ou um endpoint do mod Forge).
 *
 * Até essa integração existir, `serverOnline` reflete apenas o valor
 * configurado manualmente pelo administrador em SiteSettings, e
 * `playersOnline` é retornado como `null` — o frontend deve exibir isso
 * como "indisponível", nunca inventar um número.
 */
export async function GET() {
  const settings = await getSiteSettings();

  return NextResponse.json({
    online: settings.serverOnline,
    playersOnline: null, // TODO: integrar com API real de status do servidor (ping) quando disponível
    maxPlayers: settings.maxPlayers,
    ip: settings.serverIp,
    port: settings.serverPort,
    version: settings.serverVersion,
    modpack: settings.modpackName,
  });
}
