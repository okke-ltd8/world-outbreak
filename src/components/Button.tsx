import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-outbreak-blood text-white hover:bg-outbreak-bloodBright shadow-[0_0_0_1px_rgba(226,53,45,0.4)]",
  secondary:
    "bg-outbreak-panel2 text-outbreak-fog border border-outbreak-line hover:border-outbreak-militaryBright hover:text-white",
  ghost: "bg-transparent text-outbreak-fog hover:text-white hover:bg-white/5",
  danger:
    "bg-transparent border border-outbreak-blood text-outbreak-bloodBright hover:bg-outbreak-blood hover:text-white",
};

export function buttonClasses(variant: Variant = "primary", className?: string) {
  return clsx(
    "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return <button ref={ref} className={buttonClasses(variant, className)} {...props} />;
  }
);
Button.displayName = "Button";
