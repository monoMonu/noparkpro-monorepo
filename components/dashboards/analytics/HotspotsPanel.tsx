import { ShieldAlert } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RiskLevel, ZoneHotspot } from "@/lib/api";

function toneFromRisk(riskLevel: RiskLevel) {
  if (riskLevel === "critical") {
    return "critical";
  }
  if (riskLevel === "routine" || riskLevel === "low") {
    return "routine";
  }
  return "default";
}

export function HotspotsPanel({ hotspots }: { hotspots: ZoneHotspot[] }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>High-Risk Parking Zones</CardTitle>
          <CardDescription>Ranked by enforcement priority; counts represent observed violations</CardDescription>
        </div>
        <ShieldAlert className="h-5 w-5 text-error" />
      </CardHeader>
      <CardContent className="space-y-4">
        {hotspots.slice(0, 8).map((hotspot) => {
          const tone = toneFromRisk(hotspot.riskLevel);

          return (
            <div key={hotspot.zoneId} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface">{hotspot.zoneName}</span>
                <span className="font-medium text-on-surface-variant">{hotspot.violationCount}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-container-high">
                <div
                  className={
                    tone === "critical"
                      ? "h-2 rounded-full bg-error"
                      : tone === "default"
                        ? "h-2 rounded-full bg-primary"
                        : "h-2 rounded-full bg-secondary"
                  }
                  style={{ width: `${Math.min(100, hotspot.violationCount / 2.5)}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  );
}
