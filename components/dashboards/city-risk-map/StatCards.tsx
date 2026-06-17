import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cityStats } from "./data";

function StatCard({
  label,
  value,
  delta,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta: string;
  tone: string;
  icon: LucideIcon;
}) {
  return (
    <Card className={cn("border-t-4 bg-surface/95", tone)}>
      <CardHeader className="border-b-0 pb-1">
        <div className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">{label}</div>
        <Icon className="h-5 w-5 text-on-surface-variant" />
      </CardHeader>
      <CardContent className="flex items-end gap-3 pt-2">
        <div className={cn("font-mono text-5xl font-semibold", label.includes("High") ? "text-error" : "text-on-surface")}>
          {value}
        </div>
        <div className="pb-2 font-mono text-sm text-on-surface-variant">{delta}</div>
      </CardContent>
    </Card>
  );
}

export function StatCards() {
  return (
    <section className="grid gap-4 lg:grid-cols-4">
      {cityStats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
