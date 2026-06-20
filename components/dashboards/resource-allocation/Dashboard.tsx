"use client";

import { useState, useRef, useEffect } from "react";
import { RefreshCcw, ShieldAlert, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SummaryStats from "@/components/dashboards/resource-allocation/SummaryStats";
import SimulationNImpact from "@/components/dashboards/resource-allocation/SimulationNImpact";
import ZoneAssignment from "@/components/dashboards/resource-allocation/ZoneAssignment";
import { getResourcesSummary, getCurrentAllocationPlan } from "@/lib/api";
import type { AllocationPlan, ResourcesSummary } from "@/lib/api";

type ResourceAllocationProps = {
  initialResourcesSummary: ResourcesSummary;
  initialAllocationPlan: AllocationPlan;
  initialFilters: {
    window: string;
  };
};

export default function ResourceAllocation({
  initialResourcesSummary,
  initialAllocationPlan,
  initialFilters,
}: ResourceAllocationProps) {
  const [windowVal, setWindowVal] = useState(initialFilters.window || "today");
  const [showWindowDropdown, setShowWindowDropdown] = useState(false);

  const [resourcesSummary, setResourcesSummary] = useState<ResourcesSummary>(initialResourcesSummary);
  const [allocationPlan, setAllocationPlan] = useState<AllocationPlan>(initialAllocationPlan);

  const [availableOfficers, setAvailableOfficers] = useState(initialResourcesSummary.availableOfficers);
  const [availableTowTrucks, setAvailableTowTrucks] = useState(initialResourcesSummary.availableTowTrucks);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowWindowDropdown(false);
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

  const fetchHorizonData = async (w: string) => {
    setLoading(true);
    setError(null);
    try {
      const [resourcesRes, planRes] = await Promise.all([
        getResourcesSummary({ window: w as any }),
        getCurrentAllocationPlan({ planningWindow: w }),
      ]);

      setResourcesSummary(resourcesRes.data);
      setAllocationPlan(planRes.data);
      setAvailableOfficers(resourcesRes.data.availableOfficers);
      setAvailableTowTrucks(resourcesRes.data.availableTowTrucks);

      // Sync to URL
      const params = new URLSearchParams();
      if (w !== "today") params.set("window", w);
      const query = params.toString();
      const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load resource allocation data.");
    } finally {
      setLoading(false);
    }
  };

  const handleWindowChange = (w: string) => {
    setWindowVal(w);
    fetchHorizonData(w);
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch plan and summary from backend passing the parameters.
      // (Backend does not currently support custom allocation simulation, but we still trigger the fetch).
      const [resourcesRes, planRes] = await Promise.all([
        getResourcesSummary({ window: windowVal as any }),
        getCurrentAllocationPlan({ planningWindow: windowVal }),
      ]);

      setResourcesSummary(resourcesRes.data);
      setAllocationPlan(planRes.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Simulation failed to execute.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = () => {
    setAvailableOfficers(resourcesSummary.availableOfficers);
    setAvailableTowTrucks(resourcesSummary.availableTowTrucks);
  };

  const handleApprovePlan = () => {
    alert("Allocation plan successfully approved and deployed!");
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div ref={dropdownRef} className="relative">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowWindowDropdown(!showWindowDropdown)}
          >
            <span>{windowLabelMap[windowVal] || "Today"}</span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
          {showWindowDropdown && (
            <div className="absolute left-0 mt-1 z-50 min-w-40 rounded-md border border-outline-variant bg-surface py-1 shadow-lg">
              {Object.entries(windowLabelMap).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-surface-container-low transition-colors"
                  onClick={() => {
                    handleWindowChange(key);
                    setShowWindowDropdown(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={handleRevert}>
            <RefreshCcw className="h-4 w-4" /> Revert
          </Button>
          <Button size="sm" onClick={handleApprovePlan}>
            <ShieldAlert className="h-4 w-4" /> Approve Plan
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-error bg-error/10 p-4 text-sm text-error">
          <div className="font-semibold">Failed to process request</div>
          <div className="mt-1">{error}</div>
        </div>
      )}

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span className="text-xs font-semibold text-primary">Recalculating plan...</span>
            </div>
          </div>
        )}

        <section className="mt-6">
          <SummaryStats resourcesSummary={resourcesSummary} />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.3fr] xl:grid-cols-[340px_minmax(0,1fr)]">
          <SimulationNImpact
            resourcesSummary={resourcesSummary}
            allocationPlan={allocationPlan}
            availableOfficers={availableOfficers}
            setAvailableOfficers={setAvailableOfficers}
            availableTowTrucks={availableTowTrucks}
            setAvailableTowTrucks={setAvailableTowTrucks}
            onRunSimulation={handleRunSimulation}
            isSimulating={loading}
          />
          <ZoneAssignment assignments={allocationPlan.assignments} />
        </section>
      </div>
    </>
  );
}
