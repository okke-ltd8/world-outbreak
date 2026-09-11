import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { News } from "@prisma/client";

type NewsListItem = Pick<News, "id" | "title" | "slug" | "imageUrl" | "createdAt" | "content">;

/** GET /api/news — lista pública de notícias publicadas, mais recentes primeiro. */
export async function GET() {
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      createdAt: true,
      content: true,
    },
  });

  return NextResponse.json(
    news.map((n: NewsListItem) => ({
      ...n,
      excerpt: n.content.replace(/[#*_>`]/g, "").slice(0, 180),
      content: undefined,
    }))
  );
}
