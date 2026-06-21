import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Sparkles, TrendingUp, Info } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { AllocationPlan, ResourcesSummary } from '@/lib/api'

type SimulationNImpactProps = {
  resourcesSummary: ResourcesSummary;
  allocationPlan: AllocationPlan;
  availableOfficers: number;
  setAvailableOfficers: (val: number) => void;
  availableTowTrucks: number;
  setAvailableTowTrucks: (val: number) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
};

const SimulationNImpact = ({
  resourcesSummary,
  allocationPlan,
  availableOfficers,
  setAvailableOfficers,
  availableTowTrucks,
  setAvailableTowTrucks,
  onRunSimulation,
  isSimulating,
}: SimulationNImpactProps) => {
  // Local state to hold current simulated metrics so we can show dynamic dummy results
  const [simulatedMetrics, setSimulatedMetrics] = useState(allocationPlan.impactMetrics);
  const [localIsSimulating, setLocalIsSimulating] = useState(false);
  const [hasRunSim, setHasRunSim] = useState(false);

  // Sync with prop when allocationPlan changes initially
  useEffect(() => {
    if (!hasRunSim) {
      setSimulatedMetrics(allocationPlan.impactMetrics);
    }
  }, [allocationPlan.impactMetrics, hasRunSim]);

  const handleDummySimulation = () => {
    setLocalIsSimulating(true);
    // Simulate loading/processing delay
    setTimeout(() => {
      setLocalIsSimulating(false);
      setHasRunSim(true);

      // Calculate dummy mock changes based on officers and tow trucks compared to baseline
      const baselineOfficers = resourcesSummary.availableOfficers;
      const baselineTrucks = resourcesSummary.availableTowTrucks;

      // Multipliers representing mock efficiency changes
      const officerDiff = availableOfficers - baselineOfficers;
      const truckDiff = availableTowTrucks - baselineTrucks;

      const newMetrics = allocationPlan.impactMetrics.map(metric => {
        // Build a dynamic mock value based on inputs
        let randomFactor = 0.5 + Math.random() * 0.5;
        // Increase in resources decreases the impact scores (more coverage means less violations/impact)
        let changeEffect = (officerDiff * 1.8 + truckDiff * 2.5) * randomFactor;

        let newAfter = Math.min(95, Math.max(5, Math.round(metric.after - changeEffect)));
        let newChangePercentage = Math.round(((newAfter - metric.before) / (metric.before || 1)) * 100);

        return {
          ...metric,
          after: newAfter,
          changePercentage: newChangePercentage
        };
      });

      setSimulatedMetrics(newMetrics);
      // Trigger parent call to keep states synced if needed
      onRunSimulation();
    }, 1200);
  };

  const handleResetSimulation = () => {
    setAvailableOfficers(resourcesSummary.availableOfficers);
    setAvailableTowTrucks(resourcesSummary.availableTowTrucks);
    setSimulatedMetrics(allocationPlan.impactMetrics);
    setHasRunSim(false);
  };

  return (
    <div className="rounded-xl border border-dashed border-amber-500/30 bg-amber-500/[0.02] p-4 space-y-4">
      {/* Container Header with Proposed Tag */}
      <div className="flex items-center justify-between pb-2 border-b border-amber-500/10">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">AI Dispatcher Simulator</span>
        <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
          Proposed Feature
        </span>
      </div>

      <Card className="relative overflow-hidden border border-outline/10 bg-card">
        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant tracking-wider uppercase">
            Demo Mode
          </span>
        </div>
        <CardHeader>
          <div>
            <CardTitle>Simulation Parameters</CardTitle>
            <CardDescription>Adjust the available field capacity before running a new recommendation pass.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Officers Controller */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-on-surface-variant">
              <span>Available Officers</span>
              <span className="font-semibold text-on-surface">{availableOfficers}</span>
            </div>
            <div className="flex items-center overflow-hidden rounded-md border border-outline-variant">
              <button
                type="button"
                className="h-8 w-8 bg-surface-container-low text-sm text-on-surface-variant hover:bg-surface-variant/40"
                onClick={() => setAvailableOfficers(Math.max(0, availableOfficers - 1))}
              >
                -
              </button>
              <div className="flex h-8 flex-1 items-center justify-center bg-surface text-sm font-medium text-on-surface">
                {availableOfficers}
              </div>
              <button
                type="button"
                className="h-8 w-8 bg-surface-container-low text-sm text-on-surface-variant hover:bg-surface-variant/40"
                onClick={() => setAvailableOfficers(availableOfficers + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Tow Trucks Controller */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-on-surface-variant">
              <span>Available Tow Trucks</span>
              <span className="font-semibold text-on-surface">{availableTowTrucks}</span>
            </div>
            <div className="flex items-center overflow-hidden rounded-md border border-outline-variant">
              <button
                type="button"
                className="h-8 w-8 bg-surface-container-low text-sm text-on-surface-variant hover:bg-surface-variant/40"
                onClick={() => setAvailableTowTrucks(Math.max(0, availableTowTrucks - 1))}
              >
                -
              </button>
              <div className="flex h-8 flex-1 items-center justify-center bg-surface text-sm font-medium text-on-surface">
                {availableTowTrucks}
              </div>
              <button
                type="button"
                className="h-8 w-8 bg-surface-container-low text-sm text-on-surface-variant hover:bg-surface-variant/40"
                onClick={() => setAvailableTowTrucks(availableTowTrucks + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            {hasRunSim && (
              <Button
                variant={"ghost"}
                className="flex-1"
                onClick={handleResetSimulation}
                disabled={localIsSimulating || isSimulating}
              >
                Reset
              </Button>
            )}
            <Button
              className="flex-[2]"
              onClick={handleDummySimulation}
              disabled={localIsSimulating || isSimulating}
            >
              <TrendingUp className="h-4 w-4" />
              {localIsSimulating || isSimulating ? "Running Mock Simulation..." : "Run AI Simulation"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border border-outline/10 bg-card">
        {/* Loading Overlay */}
        {(localIsSimulating || isSimulating) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/70 backdrop-blur-[1.5px] transition-all duration-300">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            <span className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">Recalculating Impact...</span>
          </div>
        )}
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Impact Prediction</CardTitle>
              <CardDescription>Baseline versus projected intervention outcome.</CardDescription>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Simulated Data
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {simulatedMetrics.map((metric) => (
            <div key={metric.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-on-surface-variant">
                <span>{metric.label}</span>
                <span className={`text-xs font-semibold ${metric.changePercentage <= 0 ? 'text-primary' : 'text-error'}`}>
                  {metric.changePercentage >= 0 ? '+' : ''}{metric.changePercentage}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1/2 space-y-1">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">Before</div>
                  <div className="h-2 rounded-full bg-surface-container-high">
                    <div className="h-2 rounded-full bg-error" style={{ width: `${metric.before}%` }} />
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-on-surface-variant" />
                <div className="w-1/2 space-y-1">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">After (Simulated)</div>
                  <div className="h-2 rounded-full bg-surface-container-high">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${metric.after}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default SimulationNImpact
