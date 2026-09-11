import Link from "next/link";

interface FooterProps {
  siteName: string;
  discordInvite: string;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeUrl?: string | null;
}

export function Footer({ siteName, discordInvite, instagramUrl, tiktokUrl, youtubeUrl }: FooterProps) {
  return (
    <footer className="border-t border-outbreak-line bg-outbreak-panel">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:flex-row lg:items-start lg:justify-between lg:px-6">
        <div>
          <p className="font-display text-lg tracking-wide text-white">{siteName.toUpperCase()}</p>
          <p className="mt-2 max-w-sm text-sm text-outbreak-ash">
            Um mundo devastado. Sobreviventes que se organizam, clãs que disputam território,
            e um surto que não perdoa erros.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-outbreak-ash/70">Servidor</span>
            <Link href="/servidor" className="text-outbreak-fog hover:text-white">Status</Link>
            <Link href="/regras" className="text-outbreak-fog hover:text-white">Regras</Link>
            <Link href="/ranking" className="text-outbreak-fog hover:text-white">Ranking</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-outbreak-ash/70">Comunidade</span>
            <a href={discordInvite} target="_blank" rel="noreferrer" className="text-outbreak-fog hover:text-white">
              Discord
            </a>
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="text-outbreak-fog hover:text-white">
                Instagram
              </a>
            )}
            {tiktokUrl && (
              <a href={tiktokUrl} target="_blank" rel="noreferrer" className="text-outbreak-fog hover:text-white">
                TikTok
              </a>
            )}
            {youtubeUrl && (
              <a href={youtubeUrl} target="_blank" rel="noreferrer" className="text-outbreak-fog hover:text-white">
                YouTube
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-outbreak-line px-4 py-4 text-center text-xs text-outbreak-ash/70 lg:px-6">
        © {new Date().getFullYear()} {siteName}. Não afiliado à Mojang ou Microsoft.
      </div>
    </footer>
  );
}
