import { CityRiskMapDashboard } from "@/components/dashboards/city-risk-map/Dashboard";
import {
  getResourcesSummary,
  getRiskMap,
  getViolationsBreakdown,
  getViolationsSummary,
  getZoneHotspots,
} from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CityRiskMapCommandCenterPage() {
  const [hotspots, riskMap, violationsSummary, violationsBreakdown, resourcesSummary] = await Promise.all([
    getZoneHotspots({ window: "today", limit: 4 }),
    getRiskMap({ window: "today" }),
    getViolationsSummary({ window: "today" }),
    getViolationsBreakdown({ window: "today" }),
    getResourcesSummary({ window: "today" }),
  ]);

  return (
    <CityRiskMapDashboard
      hotspots={hotspots.data}
      riskMap={riskMap.data}
      violationsSummary={violationsSummary.data}
      violationsBreakdown={violationsBreakdown.data}
      resourcesSummary={resourcesSummary.data}
    />
  );
}
