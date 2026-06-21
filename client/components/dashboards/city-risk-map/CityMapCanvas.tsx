'use client'

import { useState, useEffect } from "react";
import { Send, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RiskMap, ViolationBreakdownItem } from "@/lib/api";
import Map from "@/components/maps/Map";
import { cn } from "@/lib/utils";

const breakdownColors = ["bg-error", "bg-tertiary", "bg-primary", "bg-outline"];
export function CityMapCanvas({ riskMap, breakdown }: { riskMap: RiskMap; breakdown: ViolationBreakdownItem[] }) {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    riskMap.zones[0]?.zoneId || ""
  );

  useEffect(() => {
    if (selectedZoneId) {
      localStorage.setItem("noparkpro_selected_zone_id", selectedZoneId);
    }
  }, [selectedZoneId]);

  const selectedZone = riskMap.zones.find(z => z.zoneId === selectedZoneId) || riskMap.zones[0];
  const visibleBreakdown = breakdown.slice(0, 3);

  const handleDispatch = () => {
    if (selectedZone) {
      alert(`Emergency dispatch triggered for ${selectedZone.zoneName}!`);
    }
  };

  const handleDetails = () => {
    if (selectedZone) {
      alert(`Details for ${selectedZone.zoneName}:\nRisk Level: ${selectedZone.riskLevel.toUpperCase()}\nRisk Score: ${selectedZone.riskScore}%\nActive Violations: ${selectedZone.activeViolations}\nEstimated Violations: ${selectedZone.estimatedViolations}`);
    }
  };

  const locations = riskMap.zones.map((zone) => ({
    id: zone.zoneId,
    longitude: zone.lng,
    latitude: zone.lat,
    riskLevel: zone.riskLevel,
    zoneName: zone.zoneName,
    riskScore: zone.riskScore,
    activeViolations: zone.activeViolations,
  }));

  return (
    <div className="relative min-h-185 overflow-hidden border border-outline-variant bg-surface-container-low">
      <div className="absolute inset-0">
        <Map 
          locations={locations} 
          viewport={riskMap.viewport} 
          height="100%" 
          onMarkerClick={(id) => setSelectedZoneId(id)}
          selectedLocationId={selectedZoneId}
        />
      </div>

      {selectedZone && (
        <Card className="absolute bottom-4 left-4 w-[min(440px,calc(100%-48px))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2 text-base font-semibold">
              <span className={cn(
                "h-2.5 w-2.5 rounded-full",
                selectedZone.riskLevel === "critical" ? "bg-error" : selectedZone.riskLevel === "elevated" || selectedZone.riskLevel === "high" ? "bg-tertiary" : "bg-primary"
              )} />
              {selectedZone.zoneName}
            </div>
            <div className={cn(
              "border px-4 py-1 font-mono text-xs",
              selectedZone.riskLevel === "critical" 
                ? "border-error/30 bg-error-container text-error" 
                : "border-primary bg-primary-container/15 text-primary"
            )}>
              {selectedZone.riskScore}% Risk
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
            <Button onClick={handleDispatch}>
              <Send className="h-4 w-4" /> Dispatch
            </Button>
            <Button variant="secondary" onClick={handleDetails}>
              <Eye className="h-4 w-4" /> Details
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
