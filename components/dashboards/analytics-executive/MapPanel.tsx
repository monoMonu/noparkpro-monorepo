import Image from "next/image";
import { Globe2, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MapPanel() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-tertiary" />
          <CardTitle>Geographic Concentration</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary">Live</Button>
          <Button size="sm" variant="secondary">Historical</Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[420px] overflow-hidden bg-inverse-surface">
          <Image
            src="/dashboards/analytics-executive-summary.png"
            alt="Analytics executive map reference"
            fill
            sizes="(max-width: 1024px) 100vw, 64vw"
            className="object-cover object-[44%_50%] opacity-35 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_48%,rgba(0,222,255,0.42),rgba(0,83,219,0.12)_34%,rgba(25,28,30,0.76)_78%)]" />
          <div className="absolute inset-8 border border-cyan-300/30" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(68,216,235,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(68,216,235,0.18)_1px,transparent_1px)] bg-size-[42px_42px]" />
          <div className="absolute right-5 top-1/2 grid -translate-y-1/2 overflow-hidden rounded-md border border-outline-variant bg-surface text-xl shadow-sm">
            <button className="h-14 w-14 border-b border-outline-variant">+</button>
            <button className="h-14 w-14 border-b border-outline-variant">−</button>
            <button className="flex h-14 w-14 items-center justify-center text-primary">
              <Layers className="h-5 w-5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
