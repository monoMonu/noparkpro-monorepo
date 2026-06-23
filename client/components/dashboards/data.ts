import { BarChart3, Bell, Compass, LayoutDashboard, MapPinned, Radar, Settings, ShieldAlert, SquareChartGantt, Users } from "lucide-react";

export type DashboardNavItem = {
  label: string;
  icon: typeof MapPinned;
  href: string;
};

export type DashboardRouteConfig = DashboardNavItem & {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
};

export const dashboardRoutes: DashboardRouteConfig[] = [
  {
    label: "City Risk Map",
    icon: MapPinned,
    href: "/dashboard/city-risk-map",
    title: "City Risk Map",
    subtitle: "Live spatial risk monitoring across stations, violations, and field-unit availability.",
    searchPlaceholder: "Search zones, active vehicles, or station IDs...",
  },
  {
    label: "Resource Allocation",
    icon: SquareChartGantt,
    href: "/dashboard/resource-allocation",
    title: "Resource Allocation",
    subtitle: "Simulate coverage, model impact, and assign resources across priority zones.",
    searchPlaceholder: "Search parameters, zones, or IDs...",
  },
  {
    label: "Prediction Center",
    icon: Radar,
    href: "/dashboard/prediction-center",
    title: "Predictive Analytics Engine",
    subtitle: "Generating next 24 hours algorithmic forecasts based on historical spatial data and live sensor feeds.",
    searchPlaceholder: "Query location, vehicle plate, or zone ID...",
  },
  {
    label: "Analytics",
    icon: LayoutDashboard,
    href: "/dashboard/analytics",
    title: "Analytics & Executive Summary",
    subtitle: "Historical trends, geographic distribution, and operational KPIs for the current shift.",
    searchPlaceholder: "Search parameters, zones, or IDs...",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    title: "Settings",
    subtitle: "Manage system preferences, access controls, and operational defaults.",
    searchPlaceholder: "Search settings...",
  },
];

export const navItems = dashboardRoutes;

export const defaultDashboardRoute = dashboardRoutes[1];

export function getDashboardRoute(pathname: string | null | undefined) {
  if (!pathname) {
    return defaultDashboardRoute;
  }

  const route = dashboardRoutes.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return route ?? defaultDashboardRoute;
}

export const sidebarFooterItems = [
  { label: "Support", icon: Compass },
  { label: "System Status", icon: ShieldAlert },
];

export const topbarIcons = [Bell, BarChart3, Users];
