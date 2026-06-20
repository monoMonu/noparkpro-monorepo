import { AlertTriangle, Crosshair, ShieldCheck } from "lucide-react";

import { KPICard } from "./KPICard";
import { HotspotsPanel } from "./HotspotsPanel";
import { MapPanel } from "./MapPanel";
import { SummaryCharts } from "./SummaryCharts";
import type {
  RiskMap,
  ViolationBreakdownItem,
  ViolationTimeseriesPoint,
  ViolationsSummary,
  ZoneHotspot,
} from "@/lib/api";
import ViolationBreakdown from "./ViolationBreakdown";

type AnalyticsExecutiveDashboardProps = {
  summary: ViolationsSummary;
  hourlySeries: ViolationTimeseriesPoint[];
  dailySeries: ViolationTimeseriesPoint[];
  breakdown: ViolationBreakdownItem[];
  hotspots: ZoneHotspot[];
  riskMap: RiskMap;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function AnalyticsExecutiveDashboard({
  summary,
  hourlySeries,
  dailySeries,
  breakdown,
  hotspots,
  riskMap,
}: AnalyticsExecutiveDashboardProps) {
  const topHotspots = hotspots.slice(0, 2);
  const executiveKpis = [
    {
      label: "Overall City Risk Level",
      value: titleCase(summary.cityRiskLevel),
      detail: `${summary.cityRiskScore}/100`,
      subdetail: `${summary.deltas.cityRiskScore >= 0 ? "+" : ""}${summary.deltas.cityRiskScore} pts VS baseline`,
      tone: "border-t-error",
      icon: AlertTriangle,
    },
    {
      label: "Critical Zones Today",
      value: formatNumber(summary.criticalZoneCount),
      detail: topHotspots[0]?.zoneName ?? "No critical zone",
      subdetail: topHotspots[1]?.zoneName ?? "Coverage stable",
      tone: "border-t-tertiary",
      icon: Crosshair,
    },
    {
      label: "Recommended Deployments",
      value: formatNumber(summary.recommendedDeploymentCount),
      detail: `${summary.deltas.activeViolations >= 0 ? "+" : ""}${summary.deltas.activeViolations} active delta`,
      subdetail: "Optimal coverage met",
      tone: "border-t-primary",
      icon: ShieldCheck,
    },
  ];

  return (
    <>

      <section className="grid gap-4 lg:grid-cols-3">
        {executiveKpis.map((item) => (
          <KPICard key={item.label} {...item} />
        ))}
      </section>

      <section>
        <MapPanel riskMap={riskMap} />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <HotspotsPanel hotspots={hotspots} />
        <ViolationBreakdown breakdown={breakdown} />
      </section>

      <section className="mt-4">
        <SummaryCharts hourlySeries={hourlySeries} dailySeries={dailySeries} />
      </section>
    </>
  );
}
