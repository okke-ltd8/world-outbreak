"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { ErrorMessage } from "@/components/ErrorMessage";

type DiscordState = "checking" | "not-member" | "member" | "error";

export function VerificationCard({ discordInvite }: { discordInvite: string }) {
  const [discordState, setDiscordState] = useState<DiscordState>("checking");
  const [discordError, setDiscordError] = useState<string | null>(null);

  const [minecraftUsername, setMinecraftUsername] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function checkMembership() {
    setDiscordState("checking");
    setDiscordError(null);
    try {
      const res = await fetch("/api/discord/member");
      const json = await res.json();
      if (!res.ok && res.status !== 401) {
        setDiscordState("error");
        setDiscordError(json.error ?? "Erro ao verificar seu status no Discord.");
        return;
      }
      setDiscordState(json.isMember ? "member" : "not-member");
    } catch {
      setDiscordState("error");
      setDiscordError("Não foi possível conectar ao servidor. Tente novamente.");
    }
  }

  useEffect(() => {
    checkMembership();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/verification/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minecraftUsername, code }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFormError(json.error ?? "Não foi possível concluir a verificação.");
        return;
      }
      setSuccess(`Conta vinculada com sucesso! Minecraft: ${json.minecraftUsername}`);
      setCode("");
    } catch {
      setFormError("Falha de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (discordState === "checking") {
    return (
      <Card className="p-8">
        <Loading label="Verificando seu status no Discord..." />
      </Card>
    );
  }

  if (discordState === "error") {
    return (
      <Card className="p-8 space-y-4">
        <ErrorMessage>{discordError}</ErrorMessage>
        <Button variant="secondary" onClick={checkMembership}>
          Tentar novamente
        </Button>
      </Card>
    );
  }

  if (discordState === "not-member") {
    return (
      <Card className="p-8 text-center space-y-5">
        <p className="text-lg text-white">
          Você ainda não faz parte do Discord do World Outbreak.
        </p>
        <p className="text-sm text-outbreak-ash">
          Entre na nossa comunidade para poder vincular sua conta Minecraft.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={discordInvite} target="_blank" rel="noreferrer" className="contents">
            <Button variant="primary">Entrar no Discord</Button>
          </a>
          <Button variant="secondary" onClick={checkMembership}>
            Já entrei — verificar novamente
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 space-y-6">
      <div className="flex items-center gap-2 text-sm text-outbreak-militaryBright">
        <span>✅</span>
        <span>Discord conectado — você é membro do World Outbreak</span>
      </div>

      <div>
        <h2 className="font-display text-2xl text-white">Vincule sua conta Minecraft</h2>
        <p className="mt-2 text-sm text-outbreak-ash">
          Para jogar no World Outbreak, você precisa vincular sua conta Minecraft à sua
          conta Discord. Entre no servidor para receber seu código de verificação.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="minecraftUsername" className="mb-1 block text-sm text-outbreak-fog">
            Nome do Minecraft
          </label>
          <input
            id="minecraftUsername"
            required
            minLength={3}
            maxLength={16}
            pattern="[a-zA-Z0-9_]+"
            value={minecraftUsername}
            onChange={(e) => setMinecraftUsername(e.target.value)}
            placeholder="Steve"
            className="w-full rounded-sm border border-outbreak-line bg-outbreak-panel2 px-4 py-2.5 text-white placeholder:text-outbreak-ash/50 focus:border-outbreak-bloodBright"
          />
        </div>

        <div>
          <label htmlFor="code" className="mb-1 block text-sm text-outbreak-fog">
            Código de verificação
          </label>
          <input
            id="code"
            required
            inputMode="numeric"
            pattern="\d{5}"
            maxLength={5}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="58321"
            className="w-full rounded-sm border border-outbreak-line bg-outbreak-panel2 px-4 py-2.5 font-mono text-lg tracking-[0.3em] text-white placeholder:tracking-normal placeholder:text-outbreak-ash/50 focus:border-outbreak-bloodBright"
          />
        </div>

        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        {success && (
          <p className="rounded-sm border border-outbreak-militaryBright/50 bg-outbreak-military/10 px-4 py-3 text-sm text-green-200">
            {success}
          </p>
        )}

        <Button type="submit" disabled={submitting} className="w-full justify-center">
          {submitting ? "Verificando..." : "Verificar conta"}
        </Button>
      </form>
    </Card>
  );
}
