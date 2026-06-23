"use client";

import { useState, useRef, useEffect } from "react";
import { AlertTriangle, Crosshair, ShieldCheck, ChevronDown, CalendarRange, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KPICard } from "./KPICard";
import { HotspotsPanel } from "./HotspotsPanel";
import { MapPanel } from "./MapPanel";
import { SummaryCharts } from "./SummaryCharts";
import ViolationBreakdown from "./ViolationBreakdown";
import {
  getAnalyticsSummary,
} from "@/lib/api";
import type {
  RiskMap,
  ViolationBreakdownItem,
  ViolationTimeseriesPoint,
  ViolationsSummary,
  ZoneHotspot,
  AnalyticsSummary,
  RiskMapZone,
} from "@/lib/api";

type AnalyticsExecutiveDashboardProps = {
  initialAnalyticsSummary: AnalyticsSummary;
  initialBreakdown: ViolationBreakdownItem[];
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

function formatDateLabel(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

const mapHourly = (dist: Array<{ hour: number; violations: number }>): ViolationTimeseriesPoint[] =>
  dist.map((item) => ({
    label: `${String(item.hour).padStart(2, "0")}:00`,
    value: item.violations,
    series: "actual",
  }));

const mapDaily = (trend: Array<{ date: string; violations: number }>): ViolationTimeseriesPoint[] =>
  trend.map((item) => ({
    timestamp: item.date,
    label: formatDateLabel(item.date),
    value: item.violations,
    series: "actual",
    alpha: item.violations,
    beta: item.violations,
  }));

const mapHotspots = (
  topZones: Array<{ police_station: string; violations: number }>,
  zones: RiskMapZone[]
): ZoneHotspot[] =>
  topZones.map((z, index) => {
    const match = zones.find((r) => r.zoneName === z.police_station);
    return {
      zoneId: match?.zoneId || `top-${index}`,
      rank: index + 1,
      zoneName: z.police_station,
      shortName: z.police_station.slice(0, 20),
      violationCount: z.violations,
      estimatedViolations: match?.estimatedViolations || 0,
      riskScore: match?.riskScore || 0,
      riskLevel: match?.riskLevel || "routine",
      summary: `Est. ${match?.estimatedViolations || 0} violations`,
    };
  });

export function AnalyticsExecutiveDashboard({
  initialAnalyticsSummary,
  initialBreakdown,
  initialRiskMap,
  initialFilters,
}: AnalyticsExecutiveDashboardProps) {
  const [windowVal, setWindowVal] = useState(initialFilters.window || "today");
  const [showDropdown, setShowDropdown] = useState(false);

  const [summary, setSummary] = useState<ViolationsSummary>({
    activeViolations: initialAnalyticsSummary.totalViolationsInWindow,
    predictedViolations24h: 0, // Not explicitly used in the card view main metrics but kept for typing compatibility
    projectedViolations7d: 0,
    highRiskZoneCount: initialAnalyticsSummary.criticalZonesToday,
    criticalZoneCount: initialAnalyticsSummary.criticalZonesToday,
    recommendedDeploymentCount: initialAnalyticsSummary.recommendedDeployments,
    cityRiskScore: initialAnalyticsSummary.overallCityRiskScore,
    cityRiskLevel: initialAnalyticsSummary.overallCityRiskLevel,
    deltas: {
      activeViolations: 0,
      cityRiskScore: 0,
      projectedViolations7dPercentage: 0,
    },
    generatedAt: new Date().toISOString(),
  });

  const [hourlySeries, setHourlySeries] = useState<ViolationTimeseriesPoint[]>(
    mapHourly(initialAnalyticsSummary.hourlyDistribution)
  );
  const [dailySeries, setDailySeries] = useState<ViolationTimeseriesPoint[]>(
    mapDaily(initialAnalyticsSummary.dailyTrend)
  );
  const [breakdown] = useState<ViolationBreakdownItem[]>(initialBreakdown);
  const [hotspots, setHotspots] = useState<ZoneHotspot[]>(
    mapHotspots(initialAnalyticsSummary.topZones, initialRiskMap.zones)
  );
  const [riskMap] = useState<RiskMap>(initialRiskMap);

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
      const summaryRes = await getAnalyticsSummary({ window: w as any });
      const summaryData = summaryRes.data;

      setSummary({
        activeViolations: summaryData.totalViolationsInWindow,
        predictedViolations24h: 0,
        projectedViolations7d: 0,
        highRiskZoneCount: summaryData.criticalZonesToday,
        criticalZoneCount: summaryData.criticalZonesToday,
        recommendedDeploymentCount: summaryData.recommendedDeployments,
        cityRiskScore: summaryData.overallCityRiskScore,
        cityRiskLevel: summaryData.overallCityRiskLevel,
        deltas: {
          activeViolations: 0,
          cityRiskScore: 0,
          projectedViolations7dPercentage: 0,
        },
        generatedAt: new Date().toISOString(),
      });

      setHourlySeries(mapHourly(summaryData.hourlyDistribution));
      setDailySeries(mapDaily(summaryData.dailyTrend));
      setHotspots(mapHotspots(summaryData.topZones, riskMap.zones));

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
      subdetail: `Risk Score (Next-day forecast)`,
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
      detail: `Optimal coverage targets`,
      subdetail: "officers recommended",
      tone: "border-t-primary",
      icon: ShieldCheck,
    },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-start gap-2.5 rounded-lg border border-outline-variant bg-surface-container-low p-3 text-xs text-on-surface-variant max-w-xl">
          <Info className="mt-0.5 h-4 w-4 text-primary flex-shrink-0" />
          <div>
            <span className="font-semibold text-on-surface">Forecasting Note:</span> KPIs (Risk Level, Critical Zones, and Recommended Deployments) show tomorrow's forecast predictions and do not change with the historical dropdown window.
          </div>
        </div>

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

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <HotspotsPanel hotspots={hotspots} />
          <ViolationBreakdown breakdown={breakdown} />
        </section>

        <section className="mt-4">
          <SummaryCharts hourlySeries={hourlySeries} dailySeries={dailySeries} />
        </section>

        <section className="mt-4">
          <MapPanel riskMap={riskMap} />
        </section>
      </div>
    </>
  );
}
