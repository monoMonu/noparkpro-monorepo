import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { ForecastRow, RiskLevel } from "@/lib/api";
import { filterIcon as FilterIcon } from "./data";

function labelRisk(riskLevel: RiskLevel) {
  return riskLevel.replace(/\b\w/g, (char) => char.toUpperCase());
}

function labelAction(action: string) {
  return action.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

import { Input } from "@/components/ui/input";

type ForecastLedgerProps = {
  forecasts: ForecastRow[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  riskFilter: string;
  onRiskChange: (val: string) => void;
};

export function ForecastLedger({
  forecasts,
  searchQuery,
  onSearchChange,
  riskFilter,
  onRiskChange,
}: ForecastLedgerProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
        <CardTitle className="flex items-center gap-2">
          <FilterIcon className="h-5 w-5 text-on-surface-variant" />
          Detailed Forecast Ledger
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search zones..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full sm:w-48 bg-surface-container"
          />
          <select
            value={riskFilter}
            onChange={(e) => onRiskChange(e.target.value)}
            className="flex h-9 w-full sm:w-36 rounded-md border border-outline-variant bg-surface px-3 py-1 text-sm text-on-surface shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Risk Levels</option>
            <option value="critical">Critical</option>
            <option value="elevated">Elevated </option>
            <option value="routine">Routine</option>
          </select>
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="min-w-[820px] w-full text-left text-sm">
          <thead className="bg-surface-container-low font-mono text-xs uppercase tracking-[0.18em] text-on-surface-variant">
            <tr>
              <th className="px-5 py-3">Zone Identifier</th>
              <th className="px-5 py-3">Est. Violations (Next 24h)</th>
              <th className="px-5 py-3">Confidence %</th>
              <th className="px-5 py-3">Risk Level</th>
              <th className="px-5 py-3">Congestion Impact</th>
              <th className="px-5 py-3 text-right">Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((row) => {
              const action = labelAction(row.recommendedAction);

              return (
                <tr key={row.id} className="border-t border-outline-variant">
                  <td className="px-5 py-3 font-mono">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-on-surface-variant" />
                      {row.zoneId} {row.zoneName}
                    </span>
                  </td>
                  <td className="px-10 py-3 font-mono text-right">{row.estimatedViolations}</td>
                  <td className="px-5 py-3 font-mono">{row.confidence}%</td>
                  <td className="px-5 py-3">
                    <Badge tone={row.riskLevel === "critical" ? "critical" : row.riskLevel === "elevated" ? "elevated" : "muted"}>
                      {labelRisk(row.riskLevel)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-on-surface-variant">{labelAction(row.congestionImpact)}</td>
                  <td className="px-5 py-3 text-right">
                    {action === "Automated" ? (
                      <span className="text-on-surface-variant">Automated</span>
                    ) : (
                      <Button size="sm" variant={action === "Deploy Unit" ? "default" : "secondary"}>{action}</Button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
