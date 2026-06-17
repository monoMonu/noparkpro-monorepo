import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { forecastCards } from "./data";

function ForecastKpi({
  label,
  value,
  delta,
  detail,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta: string;
  detail: string;
  tone: string;
  icon: LucideIcon;
}) {
  return (
    <Card className={cn("border-t-4", tone)}>
      <CardHeader className="border-b-0 pb-0">
        <div className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">{label}</div>
        <Icon className="h-5 w-5 text-on-surface-variant" />
      </CardHeader>
      <CardContent className="min-h-36 pt-7">
        <div className="flex items-end gap-3">
          <div className="text-5xl font-bold tracking-tight text-on-surface">{value}</div>
          <div className="pb-2 font-mono text-sm text-on-surface-variant">{delta}</div>
        </div>
        <p className="mt-5 max-w-sm text-sm text-on-surface-variant">{detail}</p>
      </CardContent>
    </Card>
  );
}

export function ForecastKpis() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {forecastCards.map((card) => (
        <ForecastKpi key={card.label} {...card} />
      ))}
    </section>
  );
}
