import { AnalyticsExecutiveDashboard } from "@/components/dashboards/analytics/Dashboard";
import {
  getRiskMap,
  getViolationsBreakdown,
  getViolationsSummary,
  getViolationsTimeseries,
  getZoneHotspots,
} from "@/lib/api";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function AnalyticsExecutiveSummaryPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const windowParam = (searchParams.window as string) || "today";

  const [summary, hourlySeries, dailySeries, breakdown, hotspots, riskMap] = await Promise.all([
    getViolationsSummary({ window: windowParam as any }),
    getViolationsTimeseries({ window: windowParam as any, metric: "violations", grain: "hour" }),
    getViolationsTimeseries({ window: windowParam === "today" ? "7d" : (windowParam as any), metric: "violations", grain: "day" }),
    getViolationsBreakdown({ window: windowParam as any }),
    getZoneHotspots({ window: windowParam as any, limit: 6 }),
    getRiskMap({ window: windowParam as any }),
  ]);

  return (
    <AnalyticsExecutiveDashboard
      initialSummary={summary.data}
      initialHourlySeries={hourlySeries.data}
      initialDailySeries={dailySeries.data}
      initialBreakdown={breakdown.data}
      initialHotspots={hotspots.data}
      initialRiskMap={riskMap.data}
      initialFilters={{ window: windowParam }}
    />
  );
}
