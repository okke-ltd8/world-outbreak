import Link from "next/link";
import { Card } from "@/components/Card";
import { buttonClasses } from "@/components/Button";

interface MinecraftAccountProps {
  linked: boolean;
  username?: string;
  verifiedAt?: Date | string;
}

export function MinecraftAccount({ linked, username, verifiedAt }: MinecraftAccountProps) {
  return (
    <Card className="p-6">
      <h3 className="font-display text-lg text-white">Minecraft</h3>
      {linked ? (
        <div className="mt-3 space-y-2">
          <p className="text-outbreak-fog">
            Conta: <span className="font-mono text-white">{username}</span>
          </p>
          <p className="flex items-center gap-2 text-sm text-outbreak-militaryBright">
            <span className="h-2 w-2 rounded-full bg-outbreak-militaryBright" />
            Verificado
          </p>
          {verifiedAt && (
            <p className="text-xs text-outbreak-ash">
              Vinculado em {new Date(verifiedAt).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3 space-y-4">
          <p className="flex items-center gap-2 text-sm text-outbreak-ash">
            <span className="h-2 w-2 rounded-full bg-outbreak-blood" />
            Não vinculado
          </p>
          <Link href="/verificacao" className={buttonClasses("primary")}>
            Vincular Minecraft
          </Link>
        </div>
      )}
    </Card>
  );
}
