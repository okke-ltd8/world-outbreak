"use client";

import { useSession } from "next-auth/react";
import { AdminHeader } from "@/components/AdminHeader";
import { SettingsForm } from "@/components/SettingsForm";

export default function AdminSettingsPage() {
  const { data: session } = useSession();

  return (
    <div>
      <AdminHeader
        title="Configurações"
        discordId={session?.user.discordId ?? ""}
        discordUsername={session?.user.discordUsername ?? ""}
        discordAvatar={session?.user.discordAvatar ?? null}
        role={session?.user.adminRole ?? null}
      />
      <div className="p-6 max-w-3xl">
        <p className="mb-6 text-sm text-outbreak-ash">
          Client Secret e Bot Token do Discord não podem ser alterados por aqui — eles
          permanecem apenas no arquivo <code className="font-mono">.env</code> do servidor.
        </p>
        <SettingsForm />
      </div>
    </div>
  );
}
