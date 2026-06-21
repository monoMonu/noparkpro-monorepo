"use client";

import { useState } from "react";
import { CityMapCanvas } from "./CityMapCanvas";
import { FilterBar } from "./FilterBar";
import { HotspotSidebar } from "./HotspotSidebar";
import { StatCards } from "./StatCards";
import { getZoneHotspots, getRiskMap, getViolationsSummary, getResourcesSummary } from "@/lib/api";
import type {
  ResourcesSummary,
  RiskMap,
  ViolationBreakdownItem,
  ViolationsSummary,
  ZoneHotspot,
} from "@/lib/api";

type CityRiskMapDashboardProps = {
  initialHotspots: ZoneHotspot[];
  initialRiskMap: RiskMap;
  initialViolationsSummary: ViolationsSummary;
  initialViolationsBreakdown: ViolationBreakdownItem[];
  initialResourcesSummary: ResourcesSummary;
  initialFilters: {
    window: string;
    stationId: string;
    violationType: string;
  };
};

export function CityRiskMapDashboard({
  initialHotspots,
  initialRiskMap,
  initialViolationsSummary,
  initialViolationsBreakdown,
  initialResourcesSummary,
  initialFilters,
}: CityRiskMapDashboardProps) {
  const [windowVal, setWindowVal] = useState(initialFilters.window || "today");
  const [stationVal, setStationVal] = useState(initialFilters.stationId || "");
  const [violationVal, setViolationVal] = useState(initialFilters.violationType || "");

  const [hotspots, setHotspots] = useState<ZoneHotspot[]>(initialHotspots);
  const [riskMap, setRiskMap] = useState<RiskMap>(initialRiskMap);
  const [summary, setSummary] = useState<ViolationsSummary>(initialViolationsSummary);
  const [resources, setResources] = useState<ResourcesSummary>(initialResourcesSummary);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stations populated from original data
  const stations = Array.from(
    new Set((initialRiskMap.zones || []).map((z) => z.zoneName))
  ).sort();

  // Violation types populated from breakdown
  const violationTypes = (initialViolationsBreakdown || []).map((v) => ({
    type: v.type,
    label: v.label,
  }));

  const fetchFilteredData = async (w: string, s: string, v: string) => {
    setLoading(true);
    setError(null);
    try {
      const [hotspotsRes, riskMapRes, summaryRes, resourcesRes] = await Promise.all([
        getZoneHotspots({ window: w as any, stationId: s, violationType: v, limit: 5 }),
        getRiskMap({ window: w as any, stationId: s, violationType: v }),
        getViolationsSummary({ window: w as any, stationId: s, violationType: v }),
        getResourcesSummary({ window: w as any, stationId: s }),
      ]);

      setHotspots(hotspotsRes.data);
      setRiskMap(riskMapRes.data);
      setSummary(summaryRes.data);
      setResources(resourcesRes.data);

      // Update URL search parameters without page refresh
      const params = new URLSearchParams();
      if (w && w !== "today") params.set("window", w);
      if (s) params.set("stationId", s);
      if (v) params.set("violationType", v);
      const query = params.toString();
      const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching the filtered data.");
    } finally {
      setLoading(false);
    }
  };

  const handleWindowChange = (w: string) => {
    setWindowVal(w);
    fetchFilteredData(w, stationVal, violationVal);
  };

  const handleStationChange = (s: string) => {
    setStationVal(s);
    fetchFilteredData(windowVal, s, violationVal);
  };

  const handleViolationChange = (v: string) => {
    setViolationVal(v);
    fetchFilteredData(windowVal, stationVal, v);
  };

  return (
    <>
      <FilterBar
        windowVal={windowVal}
        onWindowChange={handleWindowChange}
        stationVal={stationVal}
        onStationChange={handleStationChange}
        violationVal={violationVal}
        onViolationChange={handleViolationChange}
        stations={stations}
        violationTypes={violationTypes}
      />

      {error && (
        <div className="mb-6 rounded-md border border-error bg-error/10 p-4 text-sm text-error">
          <div className="font-semibold">Failed to load data</div>
          <div className="mt-1">{error}</div>
          <button
            type="button"
            className="mt-3 rounded border border-error px-3 py-1 text-xs font-semibold hover:bg-error/10"
            onClick={() => fetchFilteredData(windowVal, stationVal, violationVal)}
          >
            Retry
          </button>
        </div>
      )}

      <div className="relative overflow-hidden rounded-lg border border-outline-variant">
        {loading && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span className="text-xs font-semibold text-primary">Refetching command data...</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative">
            <div className="absolute left-6 right-6 top-6 z-10">
              <StatCards violationsSummary={summary} resourcesSummary={resources} />
            </div>
            <CityMapCanvas riskMap={riskMap} breakdown={initialViolationsBreakdown} />
          </div>
          <HotspotSidebar hotspots={hotspots} />
        </div>
      </div>
    </>
  );
}
