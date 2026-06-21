import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeTone = "default" | "critical" | "elevated" | "routine" | "muted";

const toneClasses: Record<BadgeTone, string> = {
  default: "bg-primary-container/10 text-primary border-primary/20",
  critical: "bg-error-container text-error border-error/20",
  elevated: "bg-secondary-container text-secondary border-secondary/20",
  routine: "bg-surface-container-low text-on-surface-variant border-outline-variant",
  muted: "bg-surface-container text-on-surface-variant border-outline-variant",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: BadgeTone;
}

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}