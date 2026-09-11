"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import clsx from "clsx";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/jogadores", label: "Jogadores" },
  { href: "/admin/noticias", label: "Notícias" },
  { href: "/admin/regras", label: "Regras" },
  { href: "/admin/administradores", label: "Administradores" },
  { href: "/admin/configuracoes", label: "Configurações" },
  { href: "/admin/logs", label: "Logs" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-outbreak-line bg-outbreak-panel lg:h-screen lg:w-60 lg:border-r">
      <div className="border-b border-outbreak-line px-5 py-5">
        <Link href="/" className="font-display text-lg tracking-wide text-white">
          WORLD OUTBREAK
        </Link>
        <p className="mt-0.5 text-xs uppercase tracking-wider text-outbreak-ash">Painel administrativo</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "block rounded-sm px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-outbreak-blood/15 text-white border-l-2 border-outbreak-bloodBright"
                  : "text-outbreak-ash hover:bg-white/5 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-outbreak-line px-3 py-4">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="block w-full rounded-sm px-3 py-2 text-left text-sm text-outbreak-bloodBright hover:bg-white/5"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
