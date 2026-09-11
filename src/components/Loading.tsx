import clsx from "clsx";

export function Loading({ label = "Carregando...", className }: { label?: string; className?: string }) {
  return (
    <div className={clsx("flex items-center gap-3 text-outbreak-ash text-sm", className)}>
      <span className="h-4 w-4 rounded-full border-2 border-outbreak-line border-t-outbreak-bloodBright animate-spin" />
      {label}
    </div>
  );
}
