import { PredictionCenterDashboard } from "@/components/dashboards/prediction-center/Dashboard";
import { getForecasts, getForecastsConfidence, getForecastsSummary } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function PredictionCenterForecastsPage() {
  const [summary, confidence, forecasts] = await Promise.all([
    getForecastsSummary({ horizonDays: 7 }),
    getForecastsConfidence({ horizonDays: 7 }),
    getForecasts({ horizonDays: 7, pageSize: 25 }),
  ]);

  return (
    <PredictionCenterDashboard
      summary={summary.data}
      confidence={confidence.data}
      forecasts={forecasts.data}
    />
  );
}
