import { Send, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mapPins, riskMix } from "./data";

export function CityMapCanvas() {
  return (
    <div className="relative min-h-[740px] overflow-hidden border border-outline-variant bg-surface-container-low">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(115,118,134,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(115,118,134,0.18)_1px,transparent_1px)] bg-size-[50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_43%_35%,rgba(186,26,26,0.16),transparent_13%),radial-gradient(circle_at_64%_64%,rgba(80,95,118,0.14),transparent_16%),radial-gradient(circle_at_51%_83%,rgba(0,74,198,0.11),transparent_14%)]" />
      {mapPins.map((pin) => (
        <div key={pin} className={cn("absolute h-5 w-5 rounded-full border-2 bg-surface", pin)}>
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
        </div>
      ))}

      <Card className="absolute bottom-8 left-6 w-[min(440px,calc(100%-48px))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-error" />
            Financial District Alpha
          </div>
          <div className="border border-error/30 bg-error-container px-4 py-1 font-mono text-sm text-error">98% Risk</div>
        </div>
        <div className="space-y-3">
          {riskMix.map((risk) => (
            <div key={risk.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{risk.label}</span>
                <span className="font-mono">{risk.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-container-high">
                <div className={`${risk.color} h-2 rounded-full`} style={{ width: `${risk.value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button><Send className="h-4 w-4" /> Dispatch</Button>
          <Button variant="secondary"><Eye className="h-4 w-4" /> Details</Button>
        </div>
      </Card>
    </div>
  );
}
