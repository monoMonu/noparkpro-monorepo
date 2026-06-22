export type RiskLevel = "critical" | "high" | "elevated" | "routine" | "nominal" | "low";
export type PlanStatus = "draft" | "active" | "approved" | "reverted" | "archived";

type ApiSuccess<T, M = unknown> = {
  data: T;
  meta?: M;
};

type ApiFailure = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

export type CommonQuery = {
  from?: string;
  to?: string;
  window?: "today" | "24h" | "7d" | "30d" | "custom";
  zoneId?: string;
  stationId?: string;
  violationType?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
};

export type ZoneHotspot = {
  zoneId: string;
  rank: number;
  zoneName: string;
  shortName: string;
  violationCount: number;
  estimatedViolations: number;
  riskScore: number;
  riskLevel: RiskLevel;
  summary: string;
  daysCoveredInWindow?: number;
};

export type RiskMapZone = {
  zoneId: string;
  zoneName: string;
  lat: number;
  lng: number;
  riskScore: number;
  riskLevel: RiskLevel;
  activeViolations: number;
  estimatedViolations: number;
  density: number;
};

export type RiskMap = {
  viewport: {
    center: { lat: number; lng: number };
    zoom: number;
  };
  zones: RiskMapZone[];
};

export type ViolationsSummary = {
  activeViolations: number;
  predictedViolations24h: number;
  projectedViolations7d: number;
  highRiskZoneCount: number;
  criticalZoneCount: number;
  recommendedDeploymentCount: number;
  cityRiskScore: number;
  cityRiskLevel: RiskLevel;
  deltas: {
    activeViolations: number;
    cityRiskScore: number;
    projectedViolations7dPercentage: number;
  };
  generatedAt: string;
};

export type ViolationTimeseriesPoint = {
  timestamp?: string | null;
  date?: string;
  label: string;
  value?: number;
  series?: string;
  alpha?: number;
  beta?: number;
};

export type ViolationBreakdownItem = {
  type: string;
  label: string;
  count: number;
  percentage: number;
};

export type ForecastSummary = {
  horizonDays: number;
  projectedViolations: number;
  projectedViolations7d?: number;
  projectedViolationsDeltaPercentage: number;
  highRiskZones: number;
  monitoredZones: number;
  averageModelConfidence: number;
  automationReady: boolean;
  primaryRiskZoneId: string | null;
  primaryRiskZoneName: string | null;
  generatedAt: string;
};

export type ForecastConfidencePoint = {
  date?: string | null;
  label: string;
  alpha: number;
  beta: number;
};

export type ForecastRow = {
  id: string;
  zoneId: string;
  zoneName: string;
  estimatedViolations: number;
  confidence: number;
  riskLevel: RiskLevel;
  congestionImpact: string;
  recommendedAction: string;
};

export type ResourcesSummary = {
  totalActiveResources: number;
  availableOfficers: number;
  availableTowTrucks: number;
  availableUnits: number;
  activeUnits: number;
  projectedCoverage: number;
  simulatedImpactLabel: string;
  expectedViolationReductionPercentage: number;
  deltas: {
    totalActiveResources: number;
    projectedCoverage: number;
  };
};

export type AllocationPlan = {
  id: string;
  status: PlanStatus;
  planningWindow: string;
  generatedAt: string;
  parameters: {
    availableOfficers: number;
    availableTowTrucks: number;
  };
  impactMetrics: Array<{
    id: string;
    label: string;
    before: number;
    after: number;
    changePercentage: number;
  }>;
  assignments: Array<{
    zoneId: string;
    zoneName: string;
    displayName: string;
    detail: string;
    officers: number;
    towTrucks: number;
    priority: RiskLevel;
    estimatedReductionPercentage: number;
  }>;
};

export class ApiError extends Error {
  code: string;
  status: number;
  details?: Record<string, unknown>;

  constructor(message: string, code: string, status: number, details?: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

const API_BASE_URL = (
  process.env.NOPARKPRO_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5000"
).replace(/\/$/, "");

function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

async function apiGet<T, M = unknown>(
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
): Promise<ApiSuccess<T, M>> {
  const response = await fetch(buildUrl(path, query), {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  const body = (await response.json().catch(() => null)) as ApiSuccess<T, M> | ApiFailure | null;

  if (!response.ok || !body || "error" in body) {
    const error = body && "error" in body ? body.error : undefined;
    throw new ApiError(
      error?.message ?? `Request failed for ${path}.`,
      error?.code ?? "REQUEST_FAILED",
      response.status,
      error?.details,
    );
  }

  return body;
}

export async function getZoneHotspots(query?: CommonQuery & { q?: string; riskLevel?: RiskLevel; limit?: number }) {
  return apiGet<ZoneHotspot[], { total: number }>("/api/v1/zones/hotspots", query);
}

export async function getRiskMap(query?: CommonQuery & { riskLevel?: RiskLevel }) {
  return apiGet<RiskMap>("/api/v1/zones/risk-map", query);
}

export async function getViolationsSummary(query?: CommonQuery) {
  return apiGet<ViolationsSummary>("/api/v1/violations/summary", query);
}

export async function getViolationsTimeseries(query?: CommonQuery & { metric?: "violations" | "risk_score"; grain?: "hour" | "day" }) {
  return apiGet<ViolationTimeseriesPoint[]>("/api/v1/violations/timeseries", query);
}

export async function getViolationsBreakdown(query?: CommonQuery) {
  return apiGet<ViolationBreakdownItem[]>("/api/v1/violations/breakdown", query);
}

export async function getForecastsSummary(query?: { horizonDays?: number; zoneId?: string; riskLevel?: RiskLevel; q?: string; modelVersion?: string }) {
  return apiGet<ForecastSummary>("/api/v1/forecasts/summary", query);
}

export async function getForecastsConfidence(query?: { horizonDays?: number; zoneId?: string; riskLevel?: RiskLevel; q?: string; modelVersion?: string }) {
  return apiGet<ForecastConfidencePoint[]>("/api/v1/forecasts/confidence", query);
}

export async function getForecasts(query?: { horizonDays?: number; zoneId?: string; riskLevel?: RiskLevel; q?: string; page?: number; pageSize?: number; sort?: string }) {
  return apiGet<ForecastRow[], { page: number; pageSize: number; total: number }>("/api/v1/forecasts", query);
}

export async function getResourcesSummary(query?: Pick<CommonQuery, "stationId" | "zoneId" | "window">) {
  return apiGet<ResourcesSummary>("/api/v1/resources/summary", query);
}

export type AnalyticsSummary = {
  window: "today" | "7d" | "30d";
  daysCoveredInWindow: number;
  totalViolationsInWindow: number;
  overallCityRiskLevel: RiskLevel;
  overallCityRiskScore: number;
  criticalZonesToday: number;
  recommendedDeployments: number;
  hourlyDistribution: Array<{ hour: number; violations: number }>;
  dailyTrend: Array<{ date: string; violations: number }>;
  topZones: Array<{ police_station: string; violations: number }>;
};

export async function getCurrentAllocationPlan(query?: { planningWindow?: string; stationId?: string; zoneId?: string }) {
  return apiGet<AllocationPlan>("/api/v1/allocation-plans/current", query);
}

export async function getAnalyticsSummary(query?: Pick<CommonQuery, "window">) {
  return apiGet<AnalyticsSummary>("/api/v1/analytics/summary", query);
}

