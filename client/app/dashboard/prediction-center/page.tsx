import { PredictionCenterDashboard } from "@/components/dashboards/prediction-center/Dashboard";
import { getForecasts, getForecastsConfidence, getForecastsSummary } from "@/lib/api";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function PredictionCenterForecastsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const horizonParam = parseInt((searchParams.horizonDays as string) || "7", 10);

  const [summary, confidence, forecasts] = await Promise.all([
    getForecastsSummary({ horizonDays: horizonParam }),
    getForecastsConfidence({ horizonDays: horizonParam }),
    getForecasts({ horizonDays: horizonParam, pageSize: 25 }),
  ]);

  return (
    <PredictionCenterDashboard
      initialSummary={summary.data}
      initialConfidence={confidence.data}
      initialForecasts={forecasts.data}
      initialFilters={{ horizonDays: horizonParam }}
    />
  );
}
