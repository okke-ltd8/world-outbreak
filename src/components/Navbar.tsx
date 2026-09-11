"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/Button";
import { UserAvatar } from "@/components/UserAvatar";
import clsx from "clsx";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/servidor", label: "Servidor" },
  { href: "/regras", label: "Regras" },
  { href: "/ranking", label: "Ranking" },
  { href: "/noticias", label: "Notícias" },
  { href: "/discord", label: "Discord" },
  { href: "/verificacao", label: "Verificação" },
];

export function Navbar({ siteName, logoUrl }: { siteName: string; logoUrl: string | null }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-outbreak-line bg-outbreak-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg tracking-wide text-white">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} className="h-8 w-8 object-contain" />
          ) : (
            <span className="text-outbreak-bloodBright">☣</span>
          )}
          {siteName.toUpperCase()}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded-sm px-3 py-2 text-sm transition-colors",
                pathname === link.href
                  ? "text-white"
                  : "text-outbreak-ash hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {status === "loading" ? null : session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-outbreak-fog hover:bg-white/5"
              >
                <UserAvatar
                  discordId={session.user.discordId}
                  avatarHash={session.user.discordAvatar}
                  username={session.user.discordUsername}
                  size={28}
                />
                {session.user.discordUsername}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-sm border border-outbreak-line bg-outbreak-panel py-1 shadow-panel">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-outbreak-fog hover:bg-white/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {session.user.isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-outbreak-fog hover:bg-white/5"
                      onClick={() => setMenuOpen(false)}
                    >
                      Painel administrativo
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block w-full px-4 py-2 text-left text-sm text-outbreak-bloodBright hover:bg-white/5"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="secondary" onClick={() => signIn("discord")}>
              Entrar com Discord
            </Button>
          )}
        </div>

        <button
          className="text-outbreak-fog lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-outbreak-line bg-outbreak-bg px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-sm px-3 py-2 text-sm text-outbreak-fog hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-sm px-3 py-2 text-sm text-outbreak-fog hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                {session.user.isAdmin && (
                  <Link
                    href="/admin"
                    className="rounded-sm px-3 py-2 text-sm text-outbreak-fog hover:bg-white/5"
                    onClick={() => setOpen(false)}
                  >
                    Painel administrativo
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-sm px-3 py-2 text-left text-sm text-outbreak-bloodBright hover:bg-white/5"
                >
                  Sair
                </button>
              </>
            ) : (
              <Button variant="secondary" className="mt-2" onClick={() => signIn("discord")}>
                Entrar com Discord
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
