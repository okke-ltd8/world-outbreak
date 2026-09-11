import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/NewsCard";
import type { News } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function NoticiasPage() {
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-outbreak-warn">Últimos boletins</p>
      <h1 className="mt-2 font-display text-4xl text-white">Notícias</h1>

      {news.length === 0 ? (
        <p className="mt-10 text-outbreak-ash">Nenhuma notícia publicada ainda.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n: News) => (
            <NewsCard
              key={n.id}
              slug={n.slug}
              title={n.title}
              excerpt={n.content.replace(/[#*_>`]/g, "").slice(0, 140)}
              imageUrl={n.imageUrl}
              createdAt={n.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
