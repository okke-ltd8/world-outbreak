import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, logAdminAction, getCurrentUserId } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/rateLimit";

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const news = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(news);
}

const createSchema = z.object({
  title: z.string().min(3).max(150),
  content: z.string().min(1),
  imageUrl: z.string().url().or(z.literal("")).optional(),
  published: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  let slug = slugify(parsed.data.title);
  const existing = await prisma.news.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const adminUserId = await getCurrentUserId();

  const news = await prisma.news.create({
    data: {
      title: parsed.data.title,
      slug,
      content: parsed.data.content,
      imageUrl: parsed.data.imageUrl || null,
      published: parsed.data.published,
      authorId: adminUserId,
    },
  });

  await logAdminAction({
    adminUserId,
    action: parsed.data.published ? "Admin publicou notícia" : "Admin criou rascunho de notícia",
    details: `"${news.title}" (${news.slug})`,
    ipAddress: getClientIp(req.headers),
  });

  return NextResponse.json(news, { status: 201 });
}
