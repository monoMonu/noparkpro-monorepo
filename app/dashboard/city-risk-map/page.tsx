import { CityRiskMapDashboard } from "@/components/dashboards/city-risk-map/Dashboard";
import {
  getResourcesSummary,
  getRiskMap,
  getViolationsBreakdown,
  getViolationsSummary,
  getZoneHotspots,
} from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CityRiskMapCommandCenterPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const windowParam = (searchParams.window as string) || "today";
  const stationIdParam = (searchParams.stationId as string) || "";
  const violationTypeParam = (searchParams.violationType as string) || "";

  const [hotspots, riskMap, violationsSummary, violationsBreakdown, resourcesSummary] = await Promise.all([
    getZoneHotspots({ window: windowParam as any, stationId: stationIdParam, violationType: violationTypeParam, limit: 4 }),
    getRiskMap({ window: windowParam as any, stationId: stationIdParam, violationType: violationTypeParam }),
    getViolationsSummary({ window: windowParam as any, stationId: stationIdParam, violationType: violationTypeParam }),
    getViolationsBreakdown({ window: windowParam as any }),
    getResourcesSummary({ window: windowParam as any, stationId: stationIdParam }),
  ]);

  return (
    <CityRiskMapDashboard
      initialHotspots={hotspots.data}
      initialRiskMap={riskMap.data}
      initialViolationsSummary={violationsSummary.data}
      initialViolationsBreakdown={violationsBreakdown.data}
      initialResourcesSummary={resourcesSummary.data}
      initialFilters={{
        window: windowParam,
        stationId: stationIdParam,
        violationType: violationTypeParam,
      }}
    />
  );
}
