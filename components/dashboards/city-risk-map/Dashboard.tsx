import { DashboardShell } from "@/components/dashboard-shell";
import { CityMapCanvas } from "./CityMapCanvas";
import { FilterBar } from "./FilterBar";
import { HotspotSidebar } from "./HotspotSidebar";
import { StatCards } from "./StatCards";

export function CityRiskMapDashboard() {
  return (
    <DashboardShell
      activeNav="City Risk Map"
      title="City Risk Map"
      subtitle="Live spatial risk monitoring across stations, violations, and field-unit availability."
      searchPlaceholder="Search zones, active vehicles, or station IDs..."
    >
      <FilterBar />
      <div className="overflow-hidden rounded-lg border border-outline-variant">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative">
            <div className="absolute left-6 right-6 top-6 z-10">
              <StatCards />
            </div>
            <CityMapCanvas />
          </div>
          <HotspotSidebar />
        </div>
      </div>
    </DashboardShell>
  );
}
