import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NoticiaPage({ params }: { params: { slug: string } }) {
  const news = await prisma.news.findUnique({ where: { slug: params.slug } });

  if (!news || !news.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 lg:px-6">
      <p className="text-xs text-outbreak-ash">
        {news.createdAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
      </p>
      <h1 className="mt-2 font-display text-4xl text-white">{news.title}</h1>
      {news.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={news.imageUrl} alt="" className="mt-6 w-full rounded-sm border border-outbreak-line" />
      )}
      <div className="prose prose-invert mt-8 max-w-none whitespace-pre-line text-outbreak-fog">
        {news.content}
      </div>
    </article>
  );
}
