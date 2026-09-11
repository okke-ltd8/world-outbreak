import clsx from "clsx";

export function ErrorMessage({ children, className }: { children: React.ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      className={clsx(
        "flex items-start gap-2 rounded-sm border border-outbreak-blood/50 bg-outbreak-blood/10 px-4 py-3 text-sm text-red-200",
        className
      )}
    >
      <span aria-hidden>⚠</span>
      <span>{children}</span>
    </div>
  );
}
