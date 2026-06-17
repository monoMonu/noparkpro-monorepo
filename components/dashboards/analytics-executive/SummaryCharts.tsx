import { Clock3, PieChart, TrendingUp } from "lucide-react";

import { TrendChart, ViolationsChart } from "@/components/dashboard-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { breakdown } from "./data";

export function SummaryCharts() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock3 className="h-5 w-5" />
            <CardTitle>Violations by Hour</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ViolationsChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <CardTitle>7-Day Trend</CardTitle>
          </div>
          <span className="text-sm text-on-surface-variant">↘ 4.2%</span>
        </CardHeader>
        <CardContent>
          <TrendChart compact />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            <CardTitle>Violation Breakdown</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid min-h-48 grid-cols-[0.7fr_1fr] items-center gap-4">
          <div className="font-mono text-xl text-on-surface">1.2k</div>
          <div className="space-y-4">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-on-surface-variant">
                  <span className={`${item.color} h-2.5 w-2.5 rounded-full`} />
                  {item.label}
                </span>
                <span className="font-mono text-on-surface">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
