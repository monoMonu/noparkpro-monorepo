import { Filter } from "lucide-react";

import { TrendChart, ViolationsChart } from "@/components/dashboards/dashboard-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ViolationTimeseriesPoint } from "@/lib/api";

export function SummaryCharts({
  hourlySeries,
  dailySeries,
}: {
  hourlySeries: ViolationTimeseriesPoint[];
  dailySeries: ViolationTimeseriesPoint[];
}) {
  const trendDelta =
    dailySeries.length > 1 && dailySeries[0].value
      ? ((dailySeries[dailySeries.length - 1].value ?? 0) - (dailySeries[0].value ?? 0)) / dailySeries[0].value * 100
      : 0;

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card className="flex flex-col">
        <CardHeader>
          <div>
            <CardTitle>Hourly Traffic Violation Pattern</CardTitle>
            <CardDescription>Historical distribution of violations used for temporal analysis.</CardDescription>
          </div>
          <Filter className="h-5 w-5 text-on-surface-variant" />
        </CardHeader>
        <CardContent className="min-w-0 flex-1">
          <ViolationsChart data={hourlySeries.map((item) => ({ slot: item.label, value: item.value ?? 0 }))} />
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <div>
            <CardTitle>Monthly Violation History</CardTitle>
            <CardDescription>Historical variation in recorded variations across the dataset.</CardDescription>
          </div>
          <div className="text-xs font-medium text-on-surface-variant">~{trendDelta.toFixed(1)}%</div>
        </CardHeader>
        <CardContent className="min-w-0 flex-1">
          <TrendChart data={dailySeries.map((item) => ({ day: item.label, alpha: item.value ?? item.alpha ?? 0, beta: item.beta ?? item.value ?? 0 }))} />
        </CardContent>
      </Card>
    </section>
  );
}
