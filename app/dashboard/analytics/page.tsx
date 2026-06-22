import { AnalyticsExecutiveDashboard } from "@/components/dashboards/analytics/Dashboard";
import {
  getAnalyticsSummary,
  getRiskMap,
  getViolationsBreakdown,
} from "@/lib/api";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function AnalyticsExecutiveSummaryPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const windowParam = (searchParams.window as string) || "7d";

  const [analyticsSummary, breakdown, riskMap] = await Promise.all([
    getAnalyticsSummary({ window: windowParam as any }),
    getViolationsBreakdown({ window: windowParam as any }),
    getRiskMap({ window: windowParam as any }),
  ]);

  return (
    <AnalyticsExecutiveDashboard
      initialAnalyticsSummary={analyticsSummary.data}
      initialBreakdown={breakdown.data}
      initialRiskMap={riskMap.data}
      initialFilters={{ window: windowParam }}
    />
  );
}
