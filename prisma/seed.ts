/**
 * Script de seed: cria o primeiro SUPER_ADMIN do World Outbreak.
 *
 * Sem isso, ninguém consegue acessar /admin, pois a autorização de admin
 * é checada exclusivamente contra a tabela `Admin` no banco.
 *
 * Uso:
 *   1. Defina a variável de ambiente SEED_SUPER_ADMIN_DISCORD_ID com o seu
 *      Discord ID (ative o "Modo desenvolvedor" no Discord para copiá-lo:
 *      clique com o botão direito no seu perfil > Copiar ID do usuário).
 *   2. Rode: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const discordId = process.env.SEED_SUPER_ADMIN_DISCORD_ID;
  const name = process.env.SEED_SUPER_ADMIN_NAME ?? "Fundador";

  if (!discordId) {
    console.error(
      "Defina SEED_SUPER_ADMIN_DISCORD_ID antes de rodar o seed.\n" +
        "Exemplo (PowerShell): $env:SEED_SUPER_ADMIN_DISCORD_ID=\"123456789012345678\"; npm run db:seed"
    );
    process.exit(1);
  }

  const admin = await prisma.admin.upsert({
    where: { discordId },
    update: { role: "SUPER_ADMIN", active: true },
    create: { discordId, name, role: "SUPER_ADMIN", active: true },
  });

  // Garante que a linha singleton de SiteSettings já existe com valores padrão.
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  console.log(`SUPER_ADMIN pronto: ${admin.name} (${admin.discordId})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
