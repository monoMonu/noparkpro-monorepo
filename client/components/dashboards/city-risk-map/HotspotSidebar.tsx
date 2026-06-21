import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { RiskLevel, ZoneHotspot } from "@/lib/api";

function badgeLabel(riskLevel: RiskLevel) {
  return riskLevel === "critical" ? "Critical" : riskLevel === "elevated" ? "Elevated" : riskLevel === "routine" ? "" : "High";
}

function toneClass(riskLevel: RiskLevel) {
  if (riskLevel === "critical") {
    return "border-l-error bg-surface-container";
  }
  if (riskLevel === "elevated") {
    return "border-l-primary";
  }
  return "border-l-tertiary";
}

export function HotspotSidebar({ hotspots }: { hotspots: ZoneHotspot[] }) {
  return (
    <aside className="border-l border-outline-variant bg-background p-5 lg:min-h-[740px]">
      <h2 className="text-base font-semibold">Active Hotspots</h2>
      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        <Input className="pl-9" placeholder="Search zones..." />
      </div>
      <div className="mt-6 space-y-1">
        {hotspots.map((item) => {
          const badge = badgeLabel(item.riskLevel);

          return (
          <div key={item.zoneId} className={cn("border-l-2 px-4 py-4", toneClass(item.riskLevel))}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">
                  <span className="mr-2 text-primary">#{item.rank}</span>
                  {item.shortName || item.zoneName}
                </div>
                <div className="mt-3 text-on-surface-variant text-sm">Est. Violations: {item.estimatedViolations}</div>
                <div className="text-on-surface-variant text-sm">Obs. Violations: {item.violationCount}</div>
              </div>
              <div>
                {badge ? <Badge tone={badge === "Critical" ? "critical" : badge === "Elevated" ? "elevated" : "muted"}>{badge}</Badge> : null}
                <div className="mt-6 text-right text-base font-semibold">{item.riskScore}/100</div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </aside>
  );
}
