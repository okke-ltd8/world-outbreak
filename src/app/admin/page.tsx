"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AdminHeader } from "@/components/AdminHeader";
import { Card } from "@/components/Card";
import { Loading } from "@/components/Loading";

interface Stats {
  totalPlayers: number;
  verifiedAccounts: number;
  unverifiedAccounts: number;
  adminsCount: number;
  newsCount: number;
  serverOnline: boolean;
  playersOnline: number | null;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        discordId={session?.user.discordId ?? ""}
        discordUsername={session?.user.discordUsername ?? ""}
        discordAvatar={session?.user.discordAvatar ?? null}
        role={session?.user.adminRole ?? null}
      />
      <div className="p-6">
        {!stats ? (
          <Loading label="Carregando estatísticas..." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Jogadores cadastrados", value: stats.totalPlayers },
              { label: "Contas verificadas", value: stats.verifiedAccounts },
              { label: "Contas não verificadas", value: stats.unverifiedAccounts },
              { label: "Administradores ativos", value: stats.adminsCount },
              { label: "Notícias", value: stats.newsCount },
              { label: "Status do servidor", value: stats.serverOnline ? "Online" : "Offline" },
              { label: "Jogadores online", value: stats.playersOnline ?? "Indisponível" },
            ].map((card) => (
              <Card key={card.label} className="p-6">
                <p className="text-xs uppercase tracking-wider text-outbreak-ash">{card.label}</p>
                <p className="mt-2 font-display text-3xl text-white">{card.value}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
