import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type KPICardProps = {
  label: string;
  value: string;
  detail: string;
  subdetail: string;
  tone: string;
  icon: LucideIcon;
};

export function KPICard({ label, value, detail, subdetail, tone, icon: Icon }: KPICardProps) {
  const critical = value === "Critical";

  return (
    <Card className={cn("border-t-4", tone)}>
      <CardHeader className="border-b-0 pb-0">
        <div className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
          {label}
        </div>
        <Icon className={cn("h-5 w-5", critical ? "text-error" : "text-primary")} />
      </CardHeader>
      <CardContent className="flex min-h-32 items-end justify-between gap-4 pt-8">
        <div className={cn("text-5xl font-bold tracking-tight", critical ? "text-error" : "text-on-surface")}>
          {value}
        </div>
        <div className="pb-1 text-sm text-on-surface-variant">
          <div className={critical ? "font-mono text-error" : "font-mono text-primary"}>{detail}</div>
          <div>{subdetail}</div>
        </div>
      </CardContent>
    </Card>
  );
}
