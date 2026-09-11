import Link from "next/link";
import { Card } from "@/components/Card";

interface NewsCardProps {
  slug: string;
  title: string;
  excerpt?: string;
  imageUrl?: string | null;
  createdAt: string | Date;
}

export function NewsCard({ slug, title, excerpt, imageUrl, createdAt }: NewsCardProps) {
  return (
    <Link href={`/noticias/${slug}`}>
      <Card className="group h-full overflow-hidden transition-colors hover:border-outbreak-bloodBright/60">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="h-40 w-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
        )}
        <div className="p-5">
          <p className="text-xs text-outbreak-ash">
            {new Date(createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
          <h3 className="mt-2 font-display text-xl text-white group-hover:text-outbreak-bloodBright">
            {title}
          </h3>
          {excerpt && <p className="mt-2 line-clamp-3 text-sm text-outbreak-ash">{excerpt}</p>}
        </div>
      </Card>
    </Link>
  );
}
