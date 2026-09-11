import { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-sm border border-outbreak-line bg-outbreak-panel shadow-panel",
        className
      )}
      {...props}
    />
  );
}
