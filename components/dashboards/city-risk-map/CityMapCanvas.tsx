'use client'

import { useState, useEffect } from "react";
import { Send, Eye, Activity, MapPin, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RiskMap } from "@/lib/api";
import Map from "@/components/maps/Map";
import { cn } from "@/lib/utils";

export function CityMapCanvas({ riskMap }: { riskMap: RiskMap }) {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    riskMap.zones[0]?.zoneId || ""
  );

  useEffect(() => {
    if (selectedZoneId) {
      localStorage.setItem("noparkpro_selected_zone_id", selectedZoneId);
    }
  }, [selectedZoneId]);

  const selectedZone = riskMap.zones.find(z => z.zoneId === selectedZoneId) || riskMap.zones[0];

  const handleDispatch = () => {
    if (selectedZone) {
      alert(`Emergency dispatch triggered for ${selectedZone.zoneName}!`);
    }
  };

  const handleDetails = () => {
    if (selectedZone) {
      alert(`Details for ${selectedZone.zoneName}:\nRisk Level: ${selectedZone.riskLevel.toUpperCase()}\nRisk Score: ${selectedZone.riskScore}%\nActive Violations: ${selectedZone.activeViolations}\nEstimated Violations (Next 24h): ${selectedZone.estimatedViolations}`);
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

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-surface-container-high p-3 border border-outline-variant/30">
                <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant mb-1">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  <span>Active Violations</span>
                </div>
                <div className="font-mono text-xl font-bold text-on-surface">
                  {selectedZone.activeViolations}
                </div>
              </div>

              <div className="rounded-lg bg-surface-container-high p-3 border border-outline-variant/30">
                <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant mb-1">
                  <TrendingUp className="h-3.5 w-3.5 text-tertiary" />
                  <span>Predicted (24h)</span>
                </div>
                <div className="font-mono text-xl font-bold text-on-surface">
                  {selectedZone.estimatedViolations}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                <span>Violation Density</span>
                <span className="font-mono text-on-surface font-semibold">
                  {(selectedZone.density * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-container-high">
                <div 
                  className={cn(
                    "h-2 rounded-full",
                    selectedZone.density > 0.7 
                      ? "bg-error" 
                      : selectedZone.density > 0.4 
                        ? "bg-tertiary" 
                        : "bg-primary"
                  )} 
                  style={{ width: `${Math.min(100, selectedZone.density * 100)}%` }} 
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/80 border-t border-outline-variant/50 pt-2 font-mono">
              <MapPin className="h-3.5 w-3.5 text-outline flex-shrink-0" />
              <span>Coords: {selectedZone.lat.toFixed(4)}°, {selectedZone.lng.toFixed(4)}°</span>
            </div>
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
