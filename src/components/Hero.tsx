import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import { ServerStatus } from "@/components/ServerStatus";

interface HeroProps {
  title: string;
  subtitle: string;
  discordInvite: string;
}

export function Hero({ title, subtitle, discordInvite }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-outbreak-line bg-outbreak-bg bg-grain">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #b3231f 0, #b3231f 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 lg:px-6 lg:py-28">
        <div>
          <p className="mb-3 font-mono text-xs text-outbreak-warn">
            surto ativo — nível de contenção crítico
          </p>
          <h1 className="font-display text-5xl leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-outbreak-fog">{subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/servidor" className={buttonClasses("primary")}>
            Jogar agora
          </Link>
          <a href={discordInvite} target="_blank" rel="noreferrer" className={buttonClasses("secondary")}>
            Discord
          </a>
        </div>

        <div className="rounded-sm border border-outbreak-line bg-outbreak-panel/60 px-5 py-4 backdrop-blur-sm">
          <ServerStatus />
        </div>
      </div>
    </section>
  );
}
