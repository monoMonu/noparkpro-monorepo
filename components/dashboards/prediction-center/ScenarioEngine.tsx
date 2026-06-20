import { Play, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ForecastSummary } from "@/lib/api";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function ScenarioEngine({ summary }: { summary: ForecastSummary }) {
  const baselineTotal = summary.projectedViolations7d ?? summary.projectedViolations;
  const whatIfTotal = Math.round(baselineTotal * 0.77);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Scenario Engine</CardTitle>
        <WandSparkles className="h-5 w-5 text-on-surface-variant" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border border-outline-variant bg-surface px-4 py-4">
          <div className="flex justify-between font-mono text-sm text-on-surface-variant">
            <span>Model A (Baseline)</span>
            <span className="rounded border border-outline-variant px-2">Active</span>
          </div>
          <div className="mt-3 font-mono text-sm">Status Quo Routing</div>
          <div className="mt-5 text-right text-sm text-on-surface-variant">
            Projected Total: <span className="font-mono text-on-surface">{formatNumber(baselineTotal)}</span>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="font-mono text-sm font-semibold text-primary">Model B (What-If)</div>
          <div className="mt-3 font-mono text-sm">Max Enforcement</div>
          <div className="mt-5 text-right text-sm text-on-surface-variant">
            Projected Total: <span className="font-mono text-on-surface">{formatNumber(whatIfTotal)}</span>
          </div>
        </div>
        <Button variant="secondary" className="w-full border-primary text-primary">
          <Play className="h-4 w-4" /> Run Simulation
        </Button>
      </CardContent>
    </Card>
  );
}
