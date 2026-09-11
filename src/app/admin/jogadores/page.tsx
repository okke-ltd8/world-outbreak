"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AdminHeader } from "@/components/AdminHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { ErrorMessage } from "@/components/ErrorMessage";

interface Player {
  id: string;
  discordId: string;
  discordUsername: string;
  discordAvatar: string | null;
  minecraft: { username: string; uuid: string; verifiedAt: string } | null;
  createdAt: string;
}

export default function AdminPlayersPage() {
  const { data: session } = useSession();
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [query, setQuery] = useState("");
  const [confirmTarget, setConfirmTarget] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  async function load(q?: string) {
    setPlayers(null);
    const res = await fetch(`/api/admin/players${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    const json = await res.json();
    setPlayers(json);
  }

  useEffect(() => {
    load();
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load(query);
  }

  async function confirmUnlink() {
    if (!confirmTarget) return;
    setWorking(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/players/${confirmTarget.id}/unlink`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Erro ao desvincular.");
        return;
      }
      setConfirmTarget(null);
      load(query);
    } catch {
      setError("Falha de conexão.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <div>
      <AdminHeader
        title="Jogadores"
        discordId={session?.user.discordId ?? ""}
        discordUsername={session?.user.discordUsername ?? ""}
        discordAvatar={session?.user.discordAvatar ?? null}
        role={session?.user.adminRole ?? null}
      />

      <div className="p-6">
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por Minecraft, UUID, Discord username ou ID"
            className="w-full max-w-md rounded-sm border border-outbreak-line bg-outbreak-panel2 px-3 py-2 text-white placeholder:text-outbreak-ash/50 focus:border-outbreak-bloodBright"
          />
          <Button type="submit" variant="secondary">Buscar</Button>
        </form>

        {error && <ErrorMessage className="mb-4">{error}</ErrorMessage>}

        {!players ? (
          <Loading label="Carregando jogadores..." />
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-outbreak-line text-xs uppercase tracking-wider text-outbreak-ash">
                <tr>
                  <th className="px-5 py-3">Discord</th>
                  <th className="px-5 py-3">Discord ID</th>
                  <th className="px-5 py-3">Minecraft</th>
                  <th className="px-5 py-3">UUID</th>
                  <th className="px-5 py-3">Verificado em</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.id} className="border-b border-outbreak-line last:border-none">
                    <td className="px-5 py-3 text-white">{p.discordUsername}</td>
                    <td className="px-5 py-3 font-mono text-xs text-outbreak-ash">{p.discordId}</td>
                    <td className="px-5 py-3">{p.minecraft?.username ?? "—"}</td>
                    <td className="px-5 py-3 font-mono text-xs text-outbreak-ash">{p.minecraft?.uuid ?? "—"}</td>
                    <td className="px-5 py-3 text-outbreak-ash">
                      {p.minecraft ? new Date(p.minecraft.verifiedAt).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="px-5 py-3">
                      {p.minecraft ? (
                        <span className="text-outbreak-militaryBright">Verificado</span>
                      ) : (
                        <span className="text-outbreak-ash">Não vinculado</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {p.minecraft && (
                        <Button variant="danger" onClick={() => setConfirmTarget(p)}>
                          Desvincular
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {players.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-outbreak-ash">
                      Nenhum jogador encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <Card className="w-full max-w-sm p-6 text-center">
            <p className="text-white">
              Tem certeza que deseja desvincular{" "}
              <span className="font-mono">{confirmTarget.minecraft?.username}</span> de{" "}
              <span className="font-medium">@{confirmTarget.discordUsername}</span>?
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Button variant="secondary" onClick={() => setConfirmTarget(null)} disabled={working}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmUnlink} disabled={working}>
                {working ? "Desvinculando..." : "Desvincular"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
