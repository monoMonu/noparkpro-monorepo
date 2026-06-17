import { DashboardShell } from "@/components/dashboard-shell";
import { KPICard } from "./KPICard";
import { HotspotsPanel } from "./HotspotsPanel";
import { MapPanel } from "./MapPanel";
import { SummaryCharts } from "./SummaryCharts";
import { executiveKpis } from "./data";

export function AnalyticsExecutiveDashboard() {
  return (
    <DashboardShell
      activeNav="Analytics"
      title="Analytics & Executive Summary"
      subtitle="Historical trends, geographic distribution, and operational KPIs for the current shift."
      searchPlaceholder="Search parameters, zones, vehicles..."
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {executiveKpis.map((item) => (
          <KPICard key={item.label} {...item} />
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        <MapPanel />
        <HotspotsPanel />
      </section>

      <section className="mt-4">
        <SummaryCharts />
      </section>
    </DashboardShell>
  );
}
