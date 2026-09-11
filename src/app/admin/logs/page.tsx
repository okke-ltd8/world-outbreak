"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AdminHeader } from "@/components/AdminHeader";
import { Card } from "@/components/Card";
import { Loading } from "@/components/Loading";

interface LogItem {
  id: string;
  action: string;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
  admin: { discordUsername: string };
}

export default function AdminLogsPage() {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<LogItem[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/logs")
      .then((res) => res.json())
      .then(setLogs);
  }, []);

  return (
    <div>
      <AdminHeader
        title="Logs"
        discordId={session?.user.discordId ?? ""}
        discordUsername={session?.user.discordUsername ?? ""}
        discordAvatar={session?.user.discordAvatar ?? null}
        role={session?.user.adminRole ?? null}
      />
      <div className="p-6">
        {!logs ? (
          <Loading label="Carregando logs..." />
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-outbreak-line text-xs uppercase tracking-wider text-outbreak-ash">
                <tr>
                  <th className="px-5 py-3">Administrador</th>
                  <th className="px-5 py-3">Ação</th>
                  <th className="px-5 py-3">Detalhes</th>
                  <th className="px-5 py-3">IP</th>
                  <th className="px-5 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-outbreak-line last:border-none align-top">
                    <td className="px-5 py-3 text-white">{log.admin.discordUsername}</td>
                    <td className="px-5 py-3">{log.action}</td>
                    <td className="px-5 py-3 text-outbreak-ash">{log.details ?? "—"}</td>
                    <td className="px-5 py-3 font-mono text-xs text-outbreak-ash">{log.ipAddress ?? "—"}</td>
                    <td className="px-5 py-3 text-outbreak-ash">
                      {new Date(log.createdAt).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-outbreak-ash">
                      Nenhuma ação registrada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
