"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { ErrorMessage } from "@/components/ErrorMessage";

interface Settings {
  siteName: string;
  serverName: string;
  serverIp: string;
  serverPort: number;
  serverVersion: string;
  serverDescription: string;
  modpackName: string;
  modpackUrl: string | null;
  maxPlayers: number;
  serverOnline: boolean;
  discordInvite: string;
  discordGuildId: string;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  twitterUrl: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  heroTitle: string;
  heroSubtitle: string;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-outbreak-fog">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-sm border border-outbreak-line bg-outbreak-panel2 px-3 py-2 text-white placeholder:text-outbreak-ash/50 focus:border-outbreak-bloodBright";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="font-display text-lg text-white">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </Card>
  );
}

export function SettingsForm() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => setError("Não foi possível carregar as configurações."));
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Erro ao salvar configurações.");
        return;
      }
      setSettings(json);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setError("Falha de conexão ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return error ? <ErrorMessage>{error}</ErrorMessage> : <Loading label="Carregando configurações..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section title="Site">
        <Field label="Nome do site">
          <input className={inputClass} value={settings.siteName} onChange={(e) => update("siteName", e.target.value)} />
        </Field>
        <Field label="Título do Hero">
          <input className={inputClass} value={settings.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} />
        </Field>
        <Field label="Subtítulo do Hero">
          <input className={inputClass} value={settings.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} />
        </Field>
        <Field label="URL do logo">
          <input className={inputClass} value={settings.logoUrl ?? ""} onChange={(e) => update("logoUrl", e.target.value)} />
        </Field>
        <Field label="URL do favicon">
          <input className={inputClass} value={settings.faviconUrl ?? ""} onChange={(e) => update("faviconUrl", e.target.value)} />
        </Field>
      </Section>

      <Section title="Servidor">
        <Field label="Nome do servidor">
          <input className={inputClass} value={settings.serverName} onChange={(e) => update("serverName", e.target.value)} />
        </Field>
        <Field label="IP do servidor">
          <input className={inputClass} value={settings.serverIp} onChange={(e) => update("serverIp", e.target.value)} />
        </Field>
        <Field label="Porta">
          <input type="number" className={inputClass} value={settings.serverPort} onChange={(e) => update("serverPort", Number(e.target.value))} />
        </Field>
        <Field label="Versão">
          <input className={inputClass} value={settings.serverVersion} onChange={(e) => update("serverVersion", e.target.value)} />
        </Field>
        <Field label="Modpack">
          <input className={inputClass} value={settings.modpackName} onChange={(e) => update("modpackName", e.target.value)} />
        </Field>
        <Field label="URL do modpack">
          <input className={inputClass} value={settings.modpackUrl ?? ""} onChange={(e) => update("modpackUrl", e.target.value)} />
        </Field>
        <Field label="Limite de jogadores">
          <input type="number" className={inputClass} value={settings.maxPlayers} onChange={(e) => update("maxPlayers", Number(e.target.value))} />
        </Field>
        <Field label="Status">
          <select
            className={inputClass}
            value={settings.serverOnline ? "online" : "offline"}
            onChange={(e) => update("serverOnline", e.target.value === "online")}
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Descrição">
            <textarea
              className={inputClass}
              rows={3}
              value={settings.serverDescription}
              onChange={(e) => update("serverDescription", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="Discord">
        <Field label="Link de convite">
          <input className={inputClass} value={settings.discordInvite} onChange={(e) => update("discordInvite", e.target.value)} />
        </Field>
        <Field label="Guild ID (público)">
          <input className={inputClass} value={settings.discordGuildId} onChange={(e) => update("discordGuildId", e.target.value)} />
        </Field>
      </Section>

      <Section title="Redes sociais">
        <Field label="Instagram">
          <input className={inputClass} value={settings.instagramUrl ?? ""} onChange={(e) => update("instagramUrl", e.target.value)} />
        </Field>
        <Field label="TikTok">
          <input className={inputClass} value={settings.tiktokUrl ?? ""} onChange={(e) => update("tiktokUrl", e.target.value)} />
        </Field>
        <Field label="YouTube">
          <input className={inputClass} value={settings.youtubeUrl ?? ""} onChange={(e) => update("youtubeUrl", e.target.value)} />
        </Field>
        <Field label="X / Twitter">
          <input className={inputClass} value={settings.twitterUrl ?? ""} onChange={(e) => update("twitterUrl", e.target.value)} />
        </Field>
      </Section>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && (
        <p className="rounded-sm border border-outbreak-militaryBright/50 bg-outbreak-military/10 px-4 py-3 text-sm text-green-200">
          Configurações salvas com sucesso.
        </p>
      )}

      <Button type="submit" disabled={saving}>
        {saving ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
