import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { activeHotspots } from "./data";

export function HotspotSidebar() {
  return (
    <aside className="border-l border-outline-variant bg-background p-5 lg:min-h-[740px]">
      <h2 className="text-xl font-semibold">Active Hotspots</h2>
      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        <Input className="pl-9" placeholder="Search zones..." />
      </div>
      <div className="mt-6 space-y-1">
        {activeHotspots.map((item) => (
          <div key={item.rank} className={cn("border-l-2 px-4 py-4", item.color)}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">
                  <span className="mr-2 text-primary">{item.rank}</span>
                  {item.zone}
                </div>
                <div className="mt-3 text-on-surface-variant">{item.detail}</div>
              </div>
              {item.badge ? <Badge tone={item.badge === "Critical" ? "critical" : "muted"}>{item.badge}</Badge> : null}
            </div>
            <div className="mt-2 text-right text-xl font-semibold">{item.score}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
