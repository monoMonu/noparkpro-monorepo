import { AlertTriangle, Bus, ChartNoAxesColumnIncreasing, ParkingCircle, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ResourcesSummary, ViolationsSummary } from "@/lib/api";

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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function StatCards({
  violationsSummary,
  resourcesSummary,
}: {
  violationsSummary: ViolationsSummary;
  resourcesSummary: ResourcesSummary;
}) {
  const cityStats = [
    {
      label: "Total Active",
      value: formatNumber(violationsSummary.activeViolations),
      delta: `${violationsSummary.deltas.activeViolations >= 0 ? "+" : ""}${violationsSummary.deltas.activeViolations}`,
      tone: "border-t-primary",
      icon: ParkingCircle,
    },
    {
      label: "Predicted 24h",
      value: formatNumber(violationsSummary.predictedViolations24h),
      delta: "Baseline",
      tone: "border-t-tertiary",
      icon: ChartNoAxesColumnIncreasing,
    },
    {
      label: "High Risk Zones",
      value: formatNumber(violationsSummary.highRiskZoneCount),
      delta: `${violationsSummary.criticalZoneCount} critical`,
      tone: "border-t-error",
      icon: AlertTriangle,
    },
    {
      label: "Available Units",
      value: formatNumber(resourcesSummary.availableUnits),
      delta: `/ ${formatNumber(resourcesSummary.activeUnits)} Active`,
      tone: "border-t-tertiary",
      icon: Bus,
    },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-4">
      {cityStats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
