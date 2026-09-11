"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AdminHeader } from "@/components/AdminHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { ErrorMessage } from "@/components/ErrorMessage";

interface RuleItem {
  id: string;
  category: string;
  title: string;
  content: string;
  order: number;
  active: boolean;
}

const emptyForm = { category: "Geral", title: "", content: "", order: 0, active: true };

const CATEGORIES = ["Geral", "PvP", "Clãs", "Cheats", "Exploits", "Chat", "Construções", "Punições"];

export default function AdminRulesPage() {
  const { data: session } = useSession();
  const [rules, setRules] = useState<RuleItem[] | null>(null);
  const [editing, setEditing] = useState<RuleItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/rules");
    setRules(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
    setError(null);
  }

  function openEdit(item: RuleItem) {
    setEditing(item);
    setForm({ category: item.category, title: item.title, content: item.content, order: item.order, active: item.active });
    setShowForm(true);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(editing ? `/api/admin/rules/${editing.id}` : "/api/admin/rules", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Erro ao salvar regra.");
        return;
      }
      setShowForm(false);
      load();
    } catch {
      setError("Falha de conexão.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: RuleItem) {
    await fetch(`/api/admin/rules/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    load();
  }

  async function remove(item: RuleItem) {
    if (!confirm(`Excluir a regra "${item.title}"?`)) return;
    await fetch(`/api/admin/rules/${item.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <AdminHeader
        title="Regras"
        discordId={session?.user.discordId ?? ""}
        discordUsername={session?.user.discordUsername ?? ""}
        discordAvatar={session?.user.discordAvatar ?? null}
        role={session?.user.adminRole ?? null}
      />

      <div className="p-6">
        <Button onClick={openNew} className="mb-4">
          Nova regra
        </Button>

        {!rules ? (
          <Loading label="Carregando regras..." />
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-outbreak-line text-xs uppercase tracking-wider text-outbreak-ash">
                <tr>
                  <th className="px-5 py-3">Categoria</th>
                  <th className="px-5 py-3">Título</th>
                  <th className="px-5 py-3">Ordem</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {rules.map((item) => (
                  <tr key={item.id} className="border-b border-outbreak-line last:border-none">
                    <td className="px-5 py-3 text-outbreak-ash">{item.category}</td>
                    <td className="px-5 py-3 text-white">{item.title}</td>
                    <td className="px-5 py-3">{item.order}</td>
                    <td className="px-5 py-3">
                      {item.active ? (
                        <span className="text-outbreak-militaryBright">Ativa</span>
                      ) : (
                        <span className="text-outbreak-ash">Inativa</span>
                      )}
                    </td>
                    <td className="flex justify-end gap-2 px-5 py-3">
                      <Button variant="secondary" onClick={() => toggleActive(item)}>
                        {item.active ? "Desativar" : "Ativar"}
                      </Button>
                      <Button variant="secondary" onClick={() => openEdit(item)}>
                        Editar
                      </Button>
                      <Button variant="danger" onClick={() => remove(item)}>
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
                {rules.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-outbreak-ash">
                      Nenhuma regra cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 overflow-y-auto">
          <Card className="w-full max-w-lg p-6">
            <h2 className="font-display text-xl text-white">{editing ? "Editar regra" : "Nova regra"}</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm text-outbreak-fog">Categoria</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-sm border border-outbreak-line bg-outbreak-panel2 px-3 py-2 text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-outbreak-fog">Título</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-sm border border-outbreak-line bg-outbreak-panel2 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-outbreak-fog">Conteúdo</label>
                <textarea
                  required
                  rows={5}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full rounded-sm border border-outbreak-line bg-outbreak-panel2 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-outbreak-fog">Ordem</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="w-full rounded-sm border border-outbreak-line bg-outbreak-panel2 px-3 py-2 text-white"
                />
              </div>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
