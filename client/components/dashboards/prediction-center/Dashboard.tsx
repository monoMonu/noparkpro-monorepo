"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarDays, RefreshCcw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfidenceChart } from "./ConfidenceChart";
import { ForecastKpis } from "./ForecastKpis";
import { ForecastLedger } from "./ForecastLedger";
import { ScenarioEngine } from "./ScenarioEngine";
import { getForecasts, getForecastsConfidence, getForecastsSummary } from "@/lib/api";
import type { ForecastConfidencePoint, ForecastRow, ForecastSummary } from "@/lib/api";

type PredictionCenterDashboardProps = {
  initialSummary: ForecastSummary;
  initialConfidence: ForecastConfidencePoint[];
  initialForecasts: ForecastRow[];
  initialFilters: {
    horizonDays: number;
  };
};

export function PredictionCenterDashboard({
  initialSummary,
  initialConfidence,
  initialForecasts,
  initialFilters,
}: PredictionCenterDashboardProps) {
  const [horizonVal, setHorizonVal] = useState(initialFilters.horizonDays || 7);
  const [showDropdown, setShowDropdown] = useState(false);

  const [summary, setSummary] = useState<ForecastSummary>(initialSummary);
  const [confidence, setConfidence] = useState<ForecastConfidencePoint[]>(initialConfidence);
  const [forecasts, setForecasts] = useState<ForecastRow[]>(initialForecasts);

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

  const horizonLabelMap: Record<number, string> = {
    1: "24 Hours",
    7: "7 Days",
    30: "30 Days",
  };

  const fetchHorizonPredictions = async (h: number) => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, confidenceRes, forecastsRes] = await Promise.all([
        getForecastsSummary({ horizonDays: h }),
        getForecastsConfidence({ horizonDays: h }),
        getForecasts({ horizonDays: h, pageSize: 25 }),
      ]);

      setSummary(summaryRes.data);
      setConfidence(confidenceRes.data);
      setForecasts(forecastsRes.data);

      // Sync to URL
      const params = new URLSearchParams();
      if (h !== 7) params.set("horizonDays", String(h));
      const query = params.toString();
      const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load forecast predictions.");
    } finally {
      setLoading(false);
    }
  };

  const handleHorizonChange = (h: number) => {
    setHorizonVal(h);
    fetchHorizonPredictions(h);
  };

  const handleRetrain = () => {
    alert("Model retraining request submitted successfully!");
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap justify-end gap-2">
        {/* Forecast Horizon Dropdown */}
        <div ref={dropdownRef} className="relative">
          <Button
            variant="secondary"
            className="min-w-36 flex items-center justify-between gap-2"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {horizonLabelMap[horizonVal] || "7 Days"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
          {showDropdown && (
            <div className="absolute right-0 mt-1 z-50 min-w-40 rounded-md border border-outline-variant bg-surface py-1 shadow-lg">
              {Object.entries(horizonLabelMap).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-surface-container-low transition-colors"
                  onClick={() => {
                    handleHorizonChange(Number(key));
                    setShowDropdown(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Retrain Model Button */}
        <Button variant="default" className="min-w-36" onClick={handleRetrain}>
          <RefreshCcw className="h-4 w-4" />
          Retrain Model
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-error bg-error/10 p-4 text-sm text-error">
          <div className="font-semibold">Error reloading predictions</div>
          <div className="mt-1">{error}</div>
        </div>
      )}

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span className="text-xs font-semibold text-primary">Regenerating algorithmic forecasts...</span>
            </div>
          </div>
        )}

        <ForecastKpis summary={summary} />

        <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
          <Card>
            <CardHeader>
              <CardTitle>Confidence Trend Analysis</CardTitle>
              <div className="flex gap-3 font-mono text-xs text-on-surface-variant">
                <span>
                  <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                  Alpha Model
                </span>
                <span>
                  <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-tertiary" />
                  Beta Model
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ConfidenceChart data={confidence} />
            </CardContent>
          </Card>
          <ScenarioEngine summary={summary} />
        </section>

        <section className="mt-4">
          <ForecastLedger forecasts={forecasts} />
        </section>
      </div>
    </>
  );
}
