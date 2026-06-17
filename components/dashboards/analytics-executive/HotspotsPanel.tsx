import { Flame } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hotspots } from "./data";

export function HotspotsPanel() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-error" />
          <CardTitle>Recurring Hotspots</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-8">
        {hotspots.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface">{item.label}</span>
              <span className="font-mono text-on-surface">{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-surface-container-high">
              <div className={`${item.color} h-2 rounded-full`} style={{ width: `${Math.min(100, item.value / 2.45)}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
