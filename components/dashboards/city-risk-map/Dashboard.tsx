import { CityMapCanvas } from "./CityMapCanvas";
import { FilterBar } from "./FilterBar";
import { HotspotSidebar } from "./HotspotSidebar";
import { StatCards } from "./StatCards";
import type {
  ResourcesSummary,
  RiskMap,
  ViolationBreakdownItem,
  ViolationsSummary,
  ZoneHotspot,
} from "@/lib/api";

type CityRiskMapDashboardProps = {
  hotspots: ZoneHotspot[];
  riskMap: RiskMap;
  violationsSummary: ViolationsSummary;
  violationsBreakdown: ViolationBreakdownItem[];
  resourcesSummary: ResourcesSummary;
};

export function CityRiskMapDashboard({
  hotspots,
  riskMap,
  violationsSummary,
  violationsBreakdown,
  resourcesSummary,
}: CityRiskMapDashboardProps) {
  return (
    <>
      <FilterBar />
      <div className="overflow-hidden rounded-lg border border-outline-variant">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative">
            <div className="absolute left-6 right-6 top-6 z-10">
              <StatCards violationsSummary={violationsSummary} resourcesSummary={resourcesSummary} />
            </div>
            <CityMapCanvas riskMap={riskMap} breakdown={violationsBreakdown} />
          </div>
          <HotspotSidebar hotspots={hotspots} />
        </div>
      </div>
    </>
  );
}
