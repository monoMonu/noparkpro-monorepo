import { useState } from "react";
import { Play, WandSparkles, RotateCcw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ForecastSummary } from "@/lib/api";

const SCENARIOS = [
  {
    id: "max-enforcement",
    name: "Max Patrol Enforcement",
    maxReduction: 0.45,
    description: "Deploy maximum warden patrols & automatic towing in high-risk zones.",
    complianceShift: 40,
    resourceStrain: 60,
  },
  {
    id: "incentivized-parking",
    name: "Dynamic Parking Offsets",
    maxReduction: 0.30,
    description: "Provide discounted off-street garage parking during peak risk hours.",
    complianceShift: 25,
    resourceStrain: 10,
  },
  {
    id: "transit-subsidy",
    name: "Transit Subsidization",
    maxReduction: 0.25,
    description: "Free public shuttle services in high-risk sectors to reduce street parking.",
    complianceShift: 20,
    resourceStrain: -15,
  },
  {
    id: "congestion-zone",
    name: "Congestion Pricing Zone",
    maxReduction: 0.35,
    description: "Introduce temporary access charges & strict parking curbs.",
    complianceShift: 35,
    resourceStrain: 20,
  },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function ScenarioEngine({ summary }: { summary: ForecastSummary }) {
  const baselineTotal = summary.projectedViolations7d ?? summary.projectedViolations;

  const [selectedScenarioId, setSelectedScenarioId] = useState("max-enforcement");
  const [intensity, setIntensity] = useState(50);
  const [localIsSimulating, setLocalIsSimulating] = useState(false);
  const [hasRunSim, setHasRunSim] = useState(false);

  // States to store simulated results
  const [displayScenarioId, setDisplayScenarioId] = useState("max-enforcement");
  const [displayIntensity, setDisplayIntensity] = useState(50);
  const [displayWhatIfTotal, setDisplayWhatIfTotal] = useState<number | null>(null);
  const [displayMetrics, setDisplayMetrics] = useState({
    complianceShift: 0,
    resourceStrain: 0,
    reductionPercentage: 0,
  });

  const currentScenarioObj = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];
  const displayScenarioObj = SCENARIOS.find((s) => s.id === displayScenarioId) || SCENARIOS[0];

  const handleDummySimulation = () => {
    setLocalIsSimulating(true);
    setTimeout(() => {
      setLocalIsSimulating(false);
      setHasRunSim(true);

      const intensityFactor = intensity / 100;
      const reduction = currentScenarioObj.maxReduction * intensityFactor;
      const computedTotal = Math.round(baselineTotal * (1 - reduction));

      setDisplayScenarioId(selectedScenarioId);
      setDisplayIntensity(intensity);
      setDisplayWhatIfTotal(computedTotal);
      setDisplayMetrics({
        complianceShift: Math.round(currentScenarioObj.complianceShift * intensityFactor),
        resourceStrain: Math.round(currentScenarioObj.resourceStrain * intensityFactor),
        reductionPercentage: Math.round(reduction * 100),
      });
    }, 1200);
  };

  const handleResetSimulation = () => {
    setSelectedScenarioId("max-enforcement");
    setIntensity(50);
    setHasRunSim(false);
    setDisplayWhatIfTotal(null);
  };

  return (
    <div className="rounded-xl border border-dashed border-amber-500/30 bg-amber-500/[0.02] p-4 space-y-4 h-full flex flex-col justify-between">
      {/* Container Header with Proposed Tag */}
      <div className="flex items-center justify-between pb-2 border-b border-amber-500/10">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">AI Scenario Engine</span>
        <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
          Proposed Feature
        </span>
      </div>

      <Card className="relative overflow-hidden border border-outline/10 bg-card flex-1 flex flex-col justify-between">
        {/* Loading Overlay */}
        {localIsSimulating && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/70 backdrop-blur-[1.5px] transition-all duration-300">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            <span className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">Running scenario analysis...</span>
          </div>
        )}

        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant tracking-wider uppercase">
            Demo Sandbox
          </span>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle>Scenario Policy Engine</CardTitle>
            <WandSparkles className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Scenario Selection Grid */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Select Intervention</span>
              <div className="grid grid-cols-2 gap-1.5">
                {SCENARIOS.map((scen) => (
                  <button
                    key={scen.id}
                    type="button"
                    className={`rounded-lg border px-2.5 py-1.5 text-left text-xs transition-all ${
                      selectedScenarioId === scen.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-outline-variant bg-surface hover:bg-surface-container-low"
                    }`}
                    onClick={() => setSelectedScenarioId(scen.id)}
                  >
                    <div className="font-semibold leading-tight">{scen.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Scenario Description */}
            <div className="rounded-md bg-surface-container-low/50 px-2.5 py-2 text-[11px] text-on-surface-variant border border-outline-variant/30 leading-snug">
              {currentScenarioObj.description}
            </div>

            {/* Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>Intervention Intensity</span>
                <span className="font-mono font-semibold text-primary">{intensity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-high accent-primary transition-all [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {/* Comparison Display */}
            {!hasRunSim ? (
              <div className="rounded-lg border border-dashed border-outline-variant p-4 text-center bg-surface-container-lowest/30">
                <Sparkles className="mx-auto h-5 w-5 text-on-surface-variant/40 animate-pulse" />
                <div className="mt-1.5 text-xs font-semibold text-on-surface-variant">Scenario Sandbox Ready</div>
                <div className="mt-1 text-[10px] text-on-surface-variant/60 leading-normal">
                  Configure the parameters above and run the simulation to project policy impacts.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Model A */}
                  <div className="border border-outline-variant bg-surface-container-low/30 px-3 py-2 rounded-lg">
                    <div className="font-mono text-[10px] text-on-surface-variant">Model A (Baseline)</div>
                    <div className="mt-1 font-mono text-[11px] text-on-surface-variant/80">Status Quo</div>
                    <div className="mt-2 font-mono text-sm font-semibold text-on-surface">
                      {formatNumber(baselineTotal)}
                    </div>
                  </div>
                  {/* Model B */}
                  <div className="border border-primary/20 bg-primary/[0.02] px-3 py-2 rounded-lg">
                    <div className="font-mono text-[10px] text-primary">Model B (Simulated)</div>
                    <div className="mt-1 font-mono text-[11px] text-on-surface-variant/80 truncate max-w-full">
                      {displayScenarioObj.name}
                    </div>
                    <div className="mt-2 flex items-baseline gap-1.5 justify-between">
                      <span className="font-mono text-sm font-bold text-primary">
                        {displayWhatIfTotal !== null ? formatNumber(displayWhatIfTotal) : "---"}
                      </span>
                      <span className="rounded bg-primary/10 px-1 py-0.5 text-[10px] font-bold text-primary">
                        -{displayMetrics.reductionPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-surface-container-low/50 border border-outline-variant/20 px-2.5 py-1.5">
                    <div className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Compliance Shift</div>
                    <div className="mt-0.5 font-mono text-xs font-bold text-primary">
                      +{displayMetrics.complianceShift}%
                    </div>
                  </div>
                  <div className="rounded-lg bg-surface-container-low/50 border border-outline-variant/20 px-2.5 py-1.5">
                    <div className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Resource Load</div>
                    <div className={`mt-0.5 font-mono text-xs font-bold ${
                      displayMetrics.resourceStrain > 0 
                        ? 'text-amber-500' 
                        : displayMetrics.resourceStrain < 0 
                          ? 'text-primary' 
                          : 'text-on-surface'
                    }`}>
                      {displayMetrics.resourceStrain > 0 ? '+' : ''}{displayMetrics.resourceStrain}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              {hasRunSim && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={handleResetSimulation}
                  disabled={localIsSimulating}
                >
                  <RotateCcw className="mr-1 h-3 w-3" /> Reset
                </Button>
              )}
              <Button
                size="sm"
                className="flex-[2] text-xs"
                onClick={handleDummySimulation}
                disabled={localIsSimulating}
              >
                <Play className="mr-1 h-3.5 w-3.5 fill-current" />
                {localIsSimulating ? "Projecting..." : "Run Scenario Simulation"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
