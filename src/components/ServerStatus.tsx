"use client";

import { useEffect, useState } from "react";
import { Loading } from "@/components/Loading";

interface StatusData {
  online: boolean;
  playersOnline: number | null;
  maxPlayers: number;
  ip: string;
  port: number;
  version: string;
  modpack: string;
}

export function ServerStatus() {
  const [data, setData] = useState<StatusData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/minecraft/status")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao consultar status");
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError("Não foi possível carregar o status do servidor agora.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function copyIp() {
    if (!data) return;
    navigator.clipboard.writeText(data.ip).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  if (error) {
    return <p className="text-sm text-outbreak-ash">{error}</p>;
  }

  if (!data) {
    return <Loading label="Consultando status do servidor..." />;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
      <span className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${data.online ? "bg-outbreak-militaryBright" : "bg-outbreak-ash"}`}
        />
        {data.online ? "Servidor online" : "Servidor offline"}
      </span>
      <span className="text-outbreak-ash">
        Jogadores: {data.playersOnline === null ? "indisponível" : `${data.playersOnline}/${data.maxPlayers}`}
      </span>
      <span className="text-outbreak-ash">Versão: {data.version}</span>
      <span className="text-outbreak-ash">Modpack: {data.modpack}</span>
      <button
        onClick={copyIp}
        className="rounded-sm border border-outbreak-line bg-outbreak-panel2 px-3 py-1 font-mono text-outbreak-fog hover:border-outbreak-militaryBright"
        title="Clique para copiar o IP"
      >
        {copied ? "Copiado!" : `${data.ip}:${data.port}`}
      </button>
    </div>
  );
}
