import { redirect } from "next/navigation";
import { getSession } from "@/lib/authGuard";
import { Card } from "@/components/Card";
import { DiscordLogin } from "@/components/DiscordLogin";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <Card className="p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-outbreak-warn">World Outbreak</p>
        <h1 className="mt-2 font-display text-3xl text-white">Entre na sua conta</h1>
        <p className="mt-3 text-sm text-outbreak-ash">
          Usamos o Discord para autenticação. Nunca pedimos ou armazenamos sua senha.
        </p>
        <div className="mt-6">
          <DiscordLogin />
        </div>
      </Card>
    </div>
  );
}
