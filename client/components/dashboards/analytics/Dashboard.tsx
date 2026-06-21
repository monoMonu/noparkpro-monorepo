"use client";

import { useState, useRef, useEffect } from "react";
import { AlertTriangle, Crosshair, ShieldCheck, ChevronDown, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KPICard } from "./KPICard";
import { HotspotsPanel } from "./HotspotsPanel";
import { MapPanel } from "./MapPanel";
import { SummaryCharts } from "./SummaryCharts";
import ViolationBreakdown from "./ViolationBreakdown";
import {
  getRiskMap,
  getViolationsBreakdown,
  getViolationsSummary,
  getViolationsTimeseries,
  getZoneHotspots,
} from "@/lib/api";
import type {
  RiskMap,
  ViolationBreakdownItem,
  ViolationTimeseriesPoint,
  ViolationsSummary,
  ZoneHotspot,
} from "@/lib/api";

type AnalyticsExecutiveDashboardProps = {
  initialSummary: ViolationsSummary;
  initialHourlySeries: ViolationTimeseriesPoint[];
  initialDailySeries: ViolationTimeseriesPoint[];
  initialBreakdown: ViolationBreakdownItem[];
  initialHotspots: ZoneHotspot[];
  initialRiskMap: RiskMap;
  initialFilters: {
    window: string;
  };
};

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function AnalyticsExecutiveDashboard({
  initialSummary,
  initialHourlySeries,
  initialDailySeries,
  initialBreakdown,
  initialHotspots,
  initialRiskMap,
  initialFilters,
}: AnalyticsExecutiveDashboardProps) {
  const [windowVal, setWindowVal] = useState(initialFilters.window || "today");
  const [showDropdown, setShowDropdown] = useState(false);

  const [summary, setSummary] = useState<ViolationsSummary>(initialSummary);
  const [hourlySeries, setHourlySeries] = useState<ViolationTimeseriesPoint[]>(initialHourlySeries);
  const [dailySeries, setDailySeries] = useState<ViolationTimeseriesPoint[]>(initialDailySeries);
  const [breakdown, setBreakdown] = useState<ViolationBreakdownItem[]>(initialBreakdown);
  const [hotspots, setHotspots] = useState<ZoneHotspot[]>(initialHotspots);
  const [riskMap, setRiskMap] = useState<RiskMap>(initialRiskMap);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const windowLabelMap: Record<string, string> = {
    today: "Today",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
  };

  const fetchFilteredData = async (w: string) => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, hourlyRes, dailyRes, breakdownRes, hotspotsRes, riskMapRes] = await Promise.all([
        getViolationsSummary({ window: w as any }),
        getViolationsTimeseries({ window: w as any, metric: "violations", grain: "hour" }),
        getViolationsTimeseries({ window: w === "today" ? "7d" : (w as any), metric: "violations", grain: "day" }),
        getViolationsBreakdown({ window: w as any }),
        getZoneHotspots({ window: w as any, limit: 6 }),
        getRiskMap({ window: w as any }),
      ]);

      setSummary(summaryRes.data);
      setHourlySeries(hourlyRes.data);
      setDailySeries(dailyRes.data);
      setBreakdown(breakdownRes.data);
      setHotspots(hotspotsRes.data);
      setRiskMap(riskMapRes.data);

      // Sync to URL
      const params = new URLSearchParams();
      if (w !== "today") params.set("window", w);
      const query = params.toString();
      const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  const handleWindowChange = (w: string) => {
    setWindowVal(w);
    fetchFilteredData(w);
  };

  const topHotspots = hotspots.slice(0, 2);
  const executiveKpis = [
    {
      label: "Overall City Risk Level",
      value: titleCase(summary.cityRiskLevel),
      detail: `${summary.cityRiskScore}/100`,
      subdetail: `${summary.deltas.cityRiskScore >= 0 ? "+" : ""}${summary.deltas.cityRiskScore} pts VS baseline`,
      tone: "border-t-error",
      icon: AlertTriangle,
    },
    {
      label: "Critical Zones Today",
      value: formatNumber(summary.criticalZoneCount),
      detail: topHotspots[0]?.zoneName ?? "No critical zone",
      subdetail: topHotspots[1]?.zoneName ?? "Coverage stable",
      tone: "border-t-tertiary",
      icon: Crosshair,
    },
    {
      label: "Recommended Deployments",
      value: formatNumber(summary.recommendedDeploymentCount),
      detail: `${summary.deltas.activeViolations >= 0 ? "+" : ""}${summary.deltas.activeViolations} active delta`,
      subdetail: "Optimal coverage met",
      tone: "border-t-primary",
      icon: ShieldCheck,
    },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap justify-end gap-2">
        <div ref={dropdownRef} className="relative">
          <Button
            variant="secondary"
            className="min-w-36 flex items-center justify-between gap-2"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4" />
              {windowLabelMap[windowVal] || "Today"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
          {showDropdown && (
            <div className="absolute right-0 mt-1 z-50 min-w-40 rounded-md border border-outline-variant bg-surface py-1 shadow-lg">
              {Object.entries(windowLabelMap).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-surface-container-low transition-colors"
                  onClick={() => {
                    handleWindowChange(key);
                    setShowDropdown(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-error bg-error/10 p-4 text-sm text-error">
          <div className="font-semibold">Error reloading analytics</div>
          <div className="mt-1">{error}</div>
        </div>
      )}

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span className="text-xs font-semibold text-primary">Refreshing analytics charts...</span>
            </div>
          </div>
        )}

        <section className="grid gap-4 lg:grid-cols-3">
          {executiveKpis.map((item) => (
            <KPICard key={item.label} {...item} />
          ))}
        </section>

        <section className="mt-4">
          <MapPanel riskMap={riskMap} />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <HotspotsPanel hotspots={hotspots} />
          <ViolationBreakdown breakdown={breakdown} />
        </section>

        <section className="mt-4">
          <SummaryCharts hourlySeries={hourlySeries} dailySeries={dailySeries} />
        </section>
      </div>
    </>
  );
}
