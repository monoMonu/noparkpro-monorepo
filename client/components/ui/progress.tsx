import * as React from "react";

import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export function Progress({ className, value, ...props }: ProgressProps) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-container-high", className)} {...props}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}