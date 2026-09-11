"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AdminHeader } from "@/components/AdminHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { ErrorMessage } from "@/components/ErrorMessage";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
}

const emptyForm = { title: "", content: "", imageUrl: "", published: false };

export default function AdminNewsPage() {
  const { data: session } = useSession();
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/news");
    setNews(await res.json());
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

  function openEdit(item: NewsItem) {
    setEditing(item);
    setForm({
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl ?? "",
      published: item.published,
    });
    setShowForm(true);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(editing ? `/api/admin/news/${editing.id}` : "/api/admin/news", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Erro ao salvar notícia.");
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

  async function togglePublish(item: NewsItem) {
    await fetch(`/api/admin/news/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !item.published }),
    });
    load();
  }

  async function remove(item: NewsItem) {
    if (!confirm(`Excluir a notícia "${item.title}"? Esta ação não pode ser desfeita.`)) return;
    await fetch(`/api/admin/news/${item.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <AdminHeader
        title="Notícias"
        discordId={session?.user.discordId ?? ""}
        discordUsername={session?.user.discordUsername ?? ""}
        discordAvatar={session?.user.discordAvatar ?? null}
        role={session?.user.adminRole ?? null}
      />

      <div className="p-6">
        <Button onClick={openNew} className="mb-4">
          Nova notícia
        </Button>

        {!news ? (
          <Loading label="Carregando notícias..." />
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-outbreak-line text-xs uppercase tracking-wider text-outbreak-ash">
                <tr>
                  <th className="px-5 py-3">Título</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Criada em</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item.id} className="border-b border-outbreak-line last:border-none">
                    <td className="px-5 py-3 text-white">{item.title}</td>
                    <td className="px-5 py-3">
                      {item.published ? (
                        <span className="text-outbreak-militaryBright">Publicada</span>
                      ) : (
                        <span className="text-outbreak-ash">Rascunho</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-outbreak-ash">
                      {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="flex justify-end gap-2 px-5 py-3">
                      <Button variant="secondary" onClick={() => togglePublish(item)}>
                        {item.published ? "Despublicar" : "Publicar"}
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
                {news.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-outbreak-ash">
                      Nenhuma notícia criada ainda.
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
            <h2 className="font-display text-xl text-white">{editing ? "Editar notícia" : "Nova notícia"}</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
                <label className="mb-1 block text-sm text-outbreak-fog">URL da imagem (opcional)</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full rounded-sm border border-outbreak-line bg-outbreak-panel2 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-outbreak-fog">Conteúdo</label>
                <textarea
                  required
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full rounded-sm border border-outbreak-line bg-outbreak-panel2 px-3 py-2 text-white"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-outbreak-fog">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                Publicar imediatamente
              </label>

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
