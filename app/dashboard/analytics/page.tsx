import { AnalyticsExecutiveDashboard } from "@/components/dashboards/analytics/Dashboard";
import {
  getRiskMap,
  getViolationsBreakdown,
  getViolationsSummary,
  getViolationsTimeseries,
  getZoneHotspots,
} from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AnalyticsExecutiveSummaryPage() {
  const [summary, hourlySeries, dailySeries, breakdown, hotspots, riskMap] = await Promise.all([
    getViolationsSummary({ window: "today" }),
    getViolationsTimeseries({ window: "today", metric: "violations", grain: "hour" }),
    getViolationsTimeseries({ window: "7d", metric: "violations", grain: "day" }),
    getViolationsBreakdown({ window: "today" }),
    getZoneHotspots({ window: "today", limit: 4 }),
    getRiskMap({ window: "today" }),
  ]);

  return (
    <AnalyticsExecutiveDashboard
      summary={summary.data}
      hourlySeries={hourlySeries.data}
      dailySeries={dailySeries.data}
      breakdown={breakdown.data}
      hotspots={hotspots.data}
      riskMap={riskMap.data}
    />
  );
}
