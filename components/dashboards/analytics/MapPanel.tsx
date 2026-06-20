import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RiskMap, RiskMapZone } from "@/lib/api";

const positions = [
  "left-1/3 top-1/3",
  "left-1/2 top-[58%]",
  "left-[68%] top-[42%]",
  "left-[24%] top-[66%]",
];

function markerClass(zone: RiskMapZone, index: number) {
  const position = positions[index % positions.length];
  if (zone.riskLevel === "critical") {
    return `${position} h-8 w-8 border-error bg-error/10 shadow-[0_0_24px_rgba(186,26,26,0.35)]`;
  }
  return `${position} h-5 w-5 border-outline bg-surface shadow-[0_0_18px_rgba(15,23,42,0.18)]`;
}

export function MapPanel({ riskMap }: { riskMap: RiskMap }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Geographic Concentration</CardTitle>
          <CardDescription>Visualized cluster density for the current operating area.</CardDescription>
        </div>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <Badge tone="muted">Live</Badge>
          <Badge tone="muted">Historical</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-80 overflow-hidden rounded-md border border-outline-variant bg-[radial-gradient(circle_at_center,rgba(4,74,198,0.14),rgba(4,74,198,0.04)_35%,transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(196,201,214,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(196,201,214,0.55)_1px,transparent_1px)] bg-size-[32px_32px]" />
          {riskMap.zones.slice(0, 4).map((zone, index) => (
            <div key={zone.zoneId} className={`absolute rounded-full border-2 ${markerClass(zone, index)}`} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
