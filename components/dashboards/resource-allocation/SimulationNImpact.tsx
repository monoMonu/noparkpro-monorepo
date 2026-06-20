import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react'
import React from 'react'
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
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Simulation Parameters</CardTitle>
            <CardDescription>Adjust the available field capacity before running a new recommendation pass.</CardDescription>
          </div>
          <Sparkles className="h-5 w-5 text-primary" />
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

          <Button
            className="w-full"
            onClick={onRunSimulation}
            disabled={isSimulating}
          >
            <TrendingUp className="h-4 w-4" />
            {isSimulating ? "Running Simulation..." : "Run AI Simulation"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Impact Prediction</CardTitle>
            <CardDescription>Baseline versus projected intervention outcome.</CardDescription>
          </div>
          <TrendingUp className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent className="space-y-4">
          {allocationPlan.impactMetrics.map((metric) => (
            <div key={metric.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-on-surface-variant">
                <span>{metric.label}</span>
                <span className="text-xs font-medium text-primary">{metric.changePercentage}%</span>
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
                  <div className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">After</div>
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
