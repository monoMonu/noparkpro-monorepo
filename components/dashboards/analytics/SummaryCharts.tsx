import { Filter } from "lucide-react";

import { TrendChart, ViolationsChart } from "@/components/dashboards/dashboard-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ViolationBreakdownItem, ViolationTimeseriesPoint } from "@/lib/api";

const breakdownTones = ["primary", "secondary", "error", "muted"];

export function SummaryCharts({
  hourlySeries,
  dailySeries,
  breakdown,
}: {
  hourlySeries: ViolationTimeseriesPoint[];
  dailySeries: ViolationTimeseriesPoint[];
  breakdown: ViolationBreakdownItem[];
}) {
  const trendDelta =
    dailySeries.length > 1 && dailySeries[0].value
      ? ((dailySeries[dailySeries.length - 1].value ?? 0) - (dailySeries[0].value ?? 0)) / dailySeries[0].value * 100
      : 0;

  return (
    <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr_0.85fr]">
      <Card className="flex flex-col">
        <CardHeader>
          <div>
            <CardTitle>Violations by Hour</CardTitle>
            <CardDescription>Observed enforcement volume across the day.</CardDescription>
          </div>
          <Filter className="h-5 w-5 text-on-surface-variant" />
        </CardHeader>
        <CardContent className="min-w-0 flex-1">
          <ViolationsChart data={hourlySeries.map((item) => ({ slot: item.label, value: item.value ?? 0 }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>7-Day Trend</CardTitle>
            <CardDescription>Alpha and beta model projection overlap.</CardDescription>
          </div>
          <div className="text-xs font-medium text-on-surface-variant">~{trendDelta.toFixed(1)}%</div>
        </CardHeader>
        <CardContent className="min-w-0">
          <TrendChart data={dailySeries.map((item) => ({ day: item.label, alpha: item.value ?? item.alpha ?? 0, beta: item.beta ?? item.value ?? 0 }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Violation Breakdown</CardTitle>
            <CardDescription>Category mix for current shift.</CardDescription>
          </div>
          <div className="h-5 w-5 rounded-full border border-outline-variant" />
        </CardHeader>
        <CardContent className="space-y-4">
          {breakdown.map((item, index) => {
            const tone = breakdownTones[index] ?? "muted";

            return (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className={
                    tone === "primary"
                      ? "h-2.5 w-2.5 rounded-full bg-primary"
                      : tone === "secondary"
                        ? "h-2.5 w-2.5 rounded-full bg-secondary"
                        : tone === "error"
                          ? "h-2.5 w-2.5 rounded-full bg-error"
                          : "h-2.5 w-2.5 rounded-full bg-outline-variant"
                  }
                />
                <span className="text-on-surface">{item.label}</span>
              </div>
              <span className="text-on-surface-variant">{item.percentage}%</span>
            </div>
          )})}
        </CardContent>
      </Card>
    </section>
  );
}
