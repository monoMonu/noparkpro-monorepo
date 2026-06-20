import { AlertTriangle, Cpu, TrendingUp, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ForecastSummary } from "@/lib/api";

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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function ForecastKpis({ summary }: { summary: ForecastSummary }) {
  const projectedViolations = summary.projectedViolations7d ?? summary.projectedViolations;
  const forecastCards = [
    {
      label: "Projected Violations",
      value: formatNumber(projectedViolations),
      delta: `${summary.projectedViolationsDeltaPercentage >= 0 ? "+" : ""}${summary.projectedViolationsDeltaPercentage.toFixed(1)}%`,
      detail: `Expected next ${summary.horizonDays} days based on current trajectory.`,
      tone: "border-t-error",
      icon: TrendingUp,
    },
    {
      label: "High Risk Zones Detected",
      value: formatNumber(summary.highRiskZones).padStart(2, "0"),
      delta: `/ ${formatNumber(summary.monitoredZones)} Monitored`,
      detail: summary.primaryRiskZoneName
        ? `${summary.primaryRiskZoneName} requires immediate intervention.`
        : "No primary risk zone reported.",
      tone: "border-t-tertiary",
      icon: AlertTriangle,
    },
    {
      label: "Avg Model Confidence",
      value: `${summary.averageModelConfidence.toFixed(1)}%`,
      delta: summary.automationReady ? "Stable" : "Review",
      detail: summary.automationReady ? "Ready for automated routing." : "Manual review recommended.",
      tone: "border-t-tertiary",
      icon: Cpu,
    },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {forecastCards.map((card) => (
        <ForecastKpi key={card.label} {...card} />
      ))}
    </section>
  );
}
