import { Send, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RiskMap, RiskMapZone, ViolationBreakdownItem } from "@/lib/api";

const markerPositions = [
  "left-[38%] top-[31%]",
  "left-[63%] top-[62%]",
  "left-[54%] top-[82%]",
  "left-[28%] top-[58%]",
  "left-[72%] top-[36%]",
];

const breakdownColors = ["bg-error", "bg-tertiary", "bg-primary", "bg-outline"];

function pinClass(zone: RiskMapZone, index: number) {
  const position = markerPositions[index % markerPositions.length];
  if (zone.riskLevel === "critical") {
    return `${position} border-error bg-error/10 shadow-[0_0_34px_rgba(186,26,26,0.45)]`;
  }
  if (zone.riskLevel === "elevated" || zone.riskLevel === "high") {
    return `${position} border-tertiary bg-surface shadow-[0_0_34px_rgba(80,95,118,0.25)]`;
  }
  return `${position} border-primary bg-primary/10 shadow-[0_0_34px_rgba(0,74,198,0.3)]`;
}

export function CityMapCanvas({ riskMap, breakdown }: { riskMap: RiskMap; breakdown: ViolationBreakdownItem[] }) {
  const selectedZone = riskMap.zones[0];
  const visibleBreakdown = breakdown.slice(0, 3);

  return (
    <div className="relative min-h-185 overflow-hidden border border-outline-variant bg-surface-container-low">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(115,118,134,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(115,118,134,0.18)_1px,transparent_1px)] bg-size-[50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_43%_35%,rgba(186,26,26,0.16),transparent_13%),radial-gradient(circle_at_64%_64%,rgba(80,95,118,0.14),transparent_16%),radial-gradient(circle_at_51%_83%,rgba(0,74,198,0.11),transparent_14%)]" />
      {riskMap.zones.slice(0, 5).map((zone, index) => (
        <div key={zone.zoneId} className={cn("absolute h-5 w-5 rounded-full border-2 bg-surface", pinClass(zone, index))}>
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
        </div>
      ))}

      <Card className="absolute bottom-8 left-6 w-[min(440px,calc(100%-48px))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2 text-base font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-error" />
            {selectedZone?.zoneName ?? "No active zone"}
          </div>
          <div className="border border-error/30 bg-error-container px-4 py-1 font-mono text-xs text-error">
            {selectedZone?.riskScore ?? 0}% Risk
          </div>
        </div>
        <div className="space-y-3">
          {visibleBreakdown.map((risk, index) => (
            <div key={risk.type} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{risk.label}</span>
                <span className="font-mono">{risk.percentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-container-high">
                <div className={`${breakdownColors[index] ?? "bg-outline"} h-2 rounded-full`} style={{ width: `${risk.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button><Send className="h-4 w-4" /> Dispatch</Button>
          <Button variant="secondary"><Eye className="h-4 w-4" /> Details</Button>
        </div>
      </Card>
    </div>
  );
}
