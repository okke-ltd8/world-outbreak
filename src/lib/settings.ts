import { prisma } from "@/lib/prisma";
import type { SiteSettings } from "@prisma/client";

/**
 * Camada central de configurações do site.
 *
 * TODA informação pública editável (IP, Discord, redes sociais, textos do hero, etc)
 * deve ser lida daqui, e nunca duplicada/hardcoded em outros arquivos.
 *
 * A linha com id=1 é a única linha da tabela SiteSettings (settings singleton).
 * Se ainda não existir, é criada com valores padrão na primeira leitura.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  return settings;
}

export type UpdatableSiteSettings = Partial<
  Omit<SiteSettings, "id" | "updatedAt">
>;

export async function updateSiteSettings(
  data: UpdatableSiteSettings
): Promise<SiteSettings> {
  return prisma.siteSettings.update({
    where: { id: 1 },
    data,
  });
}
