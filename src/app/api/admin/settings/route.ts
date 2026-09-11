import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, logAdminAction, getCurrentUserId } from "@/lib/authGuard";
import { getSiteSettings, updateSiteSettings } from "@/lib/settings";
import { getClientIp } from "@/lib/rateLimit";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

// Client Secret e Bot Token NUNCA passam por este schema: permanecem apenas no .env.
const updateSchema = z.object({
  siteName: z.string().min(1).max(80).optional(),
  serverName: z.string().min(1).max(80).optional(),
  serverIp: z.string().min(1).max(255).optional(),
  serverPort: z.number().int().min(1).max(65535).optional(),
  serverVersion: z.string().min(1).max(20).optional(),
  serverDescription: z.string().max(2000).optional(),
  modpackName: z.string().min(1).max(80).optional(),
  modpackUrl: z.string().url().or(z.literal("")).nullable().optional(),
  maxPlayers: z.number().int().min(1).max(100000).optional(),
  serverOnline: z.boolean().optional(),
  discordInvite: z.string().url().optional(),
  discordGuildId: z.string().max(32).optional(),
  instagramUrl: z.string().url().or(z.literal("")).nullable().optional(),
  tiktokUrl: z.string().url().or(z.literal("")).nullable().optional(),
  youtubeUrl: z.string().url().or(z.literal("")).nullable().optional(),
  twitterUrl: z.string().url().or(z.literal("")).nullable().optional(),
  logoUrl: z.string().url().or(z.literal("")).nullable().optional(),
  faviconUrl: z.string().url().or(z.literal("")).nullable().optional(),
  heroTitle: z.string().min(1).max(80).optional(),
  heroSubtitle: z.string().min(1).max(160).optional(),
});

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const json = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await updateSiteSettings(parsed.data);

  await logAdminAction({
    adminUserId: await getCurrentUserId(),
    action: "Admin alterou configurações do site",
    details: `Campos alterados: ${Object.keys(parsed.data).join(", ")}`,
    ipAddress: getClientIp(req.headers),
  });

  return NextResponse.json(updated);
}
