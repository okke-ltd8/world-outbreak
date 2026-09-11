"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AdminHeader } from "@/components/AdminHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { ErrorMessage } from "@/components/ErrorMessage";

interface AdminItem {
  id: string;
  discordId: string;
  name: string;
  role: "ADMIN" | "SUPER_ADMIN";
  active: boolean;
  createdAt: string;
}

export default function AdminAdminsPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user.adminRole === "SUPER_ADMIN";

  const [admins, setAdmins] = useState<AdminItem[] | null>(null);
  const [form, setForm] = useState({ discordId: "", name: "", role: "ADMIN" as "ADMIN" | "SUPER_ADMIN" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/admins");
    setAdmins(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Erro ao adicionar administrador.");
        return;
      }
      setForm({ discordId: "", name: "", role: "ADMIN" });
      load();
    } catch {
      setError("Falha de conexão.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: AdminItem) {
    await fetch(`/api/admin/admins/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    load();
  }

  async function remove(item: AdminItem) {
    if (!confirm(`Remover ${item.name} da lista de administradores?`)) return;
    await fetch(`/api/admin/admins/${item.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <AdminHeader
        title="Administradores"
        discordId={session?.user.discordId ?? ""}
        discordUsername={session?.user.discordUsername ?? ""}
        discordAvatar={session?.user.discordAvatar ?? null}
        role={session?.user.adminRole ?? null}
      />

      <div className="p-6 space-y-6">
        {!isSuperAdmin && (
          <ErrorMessage>
            Apenas SUPER_ADMIN pode gerenciar administradores. Você pode visualizar a lista, mas não pode fazer alterações.
          </ErrorMessage>
        )}

        {isSuperAdmin && (
          <Card className="p-6">
            <h2 className="font-display text-lg text-white">Adicionar administrador</h2>
            <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-3">
              <input
                required
                placeholder="Discord ID"
                value={form.discordId}
                onChange={(e) => setForm({ ...form, discordId: e.target.value })}
                className="rounded-sm border border-outbreak-line bg-outbreak-panel2 px-3 py-2 text-white"
              />
              <input
                required
                placeholder="Nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-sm border border-outbreak-line bg-outbreak-panel2 px-3 py-2 text-white"
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as "ADMIN" | "SUPER_ADMIN" })}
                className="rounded-sm border border-outbreak-line bg-outbreak-panel2 px-3 py-2 text-white"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
              <div className="sm:col-span-3">
                {error && <ErrorMessage className="mb-3">{error}</ErrorMessage>}
                <Button type="submit" disabled={saving}>
                  {saving ? "Adicionando..." : "Adicionar"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {!admins ? (
          <Loading label="Carregando administradores..." />
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="border-b border-outbreak-line text-xs uppercase tracking-wider text-outbreak-ash">
                <tr>
                  <th className="px-5 py-3">Nome</th>
                  <th className="px-5 py-3">Discord ID</th>
                  <th className="px-5 py-3">Cargo</th>
                  <th className="px-5 py-3">Status</th>
                  {isSuperAdmin && <th className="px-5 py-3" />}
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id} className="border-b border-outbreak-line last:border-none">
                    <td className="px-5 py-3 text-white">{a.name}</td>
                    <td className="px-5 py-3 font-mono text-xs text-outbreak-ash">{a.discordId}</td>
                    <td className="px-5 py-3">{a.role}</td>
                    <td className="px-5 py-3">
                      {a.active ? (
                        <span className="text-outbreak-militaryBright">Ativo</span>
                      ) : (
                        <span className="text-outbreak-ash">Inativo</span>
                      )}
                    </td>
                    {isSuperAdmin && (
                      <td className="flex justify-end gap-2 px-5 py-3">
                        <Button variant="secondary" onClick={() => toggleActive(a)}>
                          {a.active ? "Desativar" : "Ativar"}
                        </Button>
                        <Button variant="danger" onClick={() => remove(a)}>
                          Remover
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
