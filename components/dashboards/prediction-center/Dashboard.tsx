import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfidenceChart } from "./ConfidenceChart";
import { ForecastKpis } from "./ForecastKpis";
import { ForecastLedger } from "./ForecastLedger";
import { ScenarioEngine } from "./ScenarioEngine";
import { toolbarActions } from "./data";
import type { ForecastConfidencePoint, ForecastRow, ForecastSummary } from "@/lib/api";

type PredictionCenterDashboardProps = {
  summary: ForecastSummary;
  confidence: ForecastConfidencePoint[];
  forecasts: ForecastRow[];
};

export function PredictionCenterDashboard({ summary, confidence, forecasts }: PredictionCenterDashboardProps) {
  return (
    <>
      <div className="mb-6 flex flex-wrap justify-end gap-2">
        {toolbarActions.map((action) => (
          <Button key={action.label} variant={action.variant} className="min-w-36">
            <action.icon className="h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </div>

      <ForecastKpis summary={summary} />

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Card>
          <CardHeader>
            <CardTitle>Confidence Trend Analysis</CardTitle>
            <div className="flex gap-3 font-mono text-xs text-on-surface-variant">
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-primary" />Alpha Model</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-tertiary" />Beta Model</span>
            </div>
          </CardHeader>
          <CardContent>
            <ConfidenceChart data={confidence} />
          </CardContent>
        </Card>
        <ScenarioEngine summary={summary} />
      </section>

      <section className="mt-4">
        <ForecastLedger forecasts={forecasts} />
      </section>
    </>
  );
}
