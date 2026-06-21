import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RiskMap } from "@/lib/api";
import Map from '@/components/maps/Map';

interface Location {
  id: string;
  longitude: number;
  latitude: number;
  riskLevel: string;
}

export function MapPanel({ riskMap }: { riskMap: RiskMap }) {
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
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Geographic Concentration</CardTitle>
          <CardDescription>
            Visualized cluster density for the current operating area.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <Badge tone="muted">Live</Badge>
          <Badge tone="muted">Historical</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Map locations={locations} viewport={riskMap.viewport} />
      </CardContent>
    </Card>
  );
}