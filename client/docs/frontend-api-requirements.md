# Frontend API Requirements

This document describes the APIs needed by the current dashboard frontend. The endpoints are organized by backend resource and business capability, not by frontend screen.

The current frontend mock data lives under `components/dashboards/`. The frontend screens that consume these APIs are:

- `/dashboard/city-risk-map`
- `/dashboard/analytics`
- `/dashboard/prediction-center`
- `/dashboard/resource-allocation`
- `/dashboard/settings`

## API Conventions

Base path: `/api/v1`

Use JSON for request and response bodies. Use ISO 8601 timestamps. Return raw numbers for counts, percentages, scores, and deltas; the frontend will format values for display.

Standard success wrapper:

```json
{
  "data": {},
  "meta": {}
}
```

Standard error wrapper:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters.",
    "details": {}
  }
}
```

Common query params:

```ts
type CommonQuery = {
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
```

Common enums:

```ts
type RiskLevel = "critical" | "high" | "elevated" | "routine" | "nominal" | "low";
type PlanStatus = "draft" | "active" | "approved" | "reverted" | "archived";
type JobStatus = "queued" | "running" | "completed" | "failed";
type DispatchStatus = "queued" | "assigned" | "en_route" | "completed" | "cancelled";
```

## 1. Zones

Zones are geographic enforcement areas. They are used by the City Risk Map, Analytics, Prediction Center, and Resource Allocation screens.

### `GET /api/v1/zones`

Returns searchable zones for filters, maps, tables, and allocation planning.

Query params: `q`, `riskLevel`, `stationId`, `page`, `pageSize`

```json
{
  "data": [
    {
      "id": "Z-01A",
      "name": "Financial District Alpha",
      "shortName": "Fin. District",
      "stationId": "ST-001",
      "riskLevel": "critical",
      "riskScore": 98,
      "center": {
        "lat": 28.628,
        "lng": 77.218
      },
      "boundary": {
        "type": "Polygon",
        "coordinates": []
      }
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 25,
    "total": 45
  }
}
```

### `GET /api/v1/zones/{zoneId}`

Returns details for a selected zone.

```json
{
  "data": {
    "id": "Z-01A",
    "name": "Financial District Alpha",
    "shortName": "Fin. District",
    "stationId": "ST-001",
    "riskLevel": "critical",
    "riskScore": 98,
    "estimatedViolations24h": 120,
    "activeViolations": 54,
    "availableUnitsNearby": 8,
    "center": {
      "lat": 28.628,
      "lng": 77.218
    },
    "updatedAt": "2026-06-19T09:30:00+05:30"
  }
}
```

### `GET /api/v1/zones/hotspots`

Returns ranked hotspot zones.

Used by:

- City Risk Map active hotspots sidebar
- Analytics recurring hotspots panel

Query params: `from`, `to`, `window`, `q`, `riskLevel`, `limit`

```json
{
  "data": [
    {
      "zoneId": "Z-01A",
      "rank": 1,
      "zoneName": "Financial District Alpha",
      "shortName": "Fin. District",
      "violationCount": 245,
      "estimatedViolations": 120,
      "riskScore": 98,
      "riskLevel": "critical",
      "summary": "Est. 120 violations"
    }
  ],
  "meta": {
    "total": 4
  }
}
```

### `GET /api/v1/zones/risk-map`

Returns map-ready zone risk data. This is resource-specific map data, not a dashboard-specific endpoint.

Used by:

- City Risk Map map canvas
- Analytics geographic concentration panel

Query params: `from`, `to`, `window`, `stationId`, `violationType`, `riskLevel`

```json
{
  "data": {
    "viewport": {
      "center": { "lat": 28.6139, "lng": 77.209 },
      "zoom": 12
    },
    "zones": [
      {
        "zoneId": "Z-01A",
        "zoneName": "Financial District Alpha",
        "lat": 28.628,
        "lng": 77.218,
        "riskScore": 98,
        "riskLevel": "critical",
        "activeViolations": 54,
        "estimatedViolations": 120,
        "density": 0.94
      }
    ]
  }
}
```

## 2. Violations

Violations are parking or traffic enforcement events and predicted violation counts.

### `GET /api/v1/violations/summary`

Returns aggregate violation metrics.

Used by:

- City Risk Map stat cards
- Analytics KPI cards
- Prediction summary cards

Query params: `from`, `to`, `window`, `zoneId`, `stationId`, `violationType`

```json
{
  "data": {
    "activeViolations": 1248,
    "predictedViolations24h": 3105,
    "projectedViolations7d": 14285,
    "highRiskZoneCount": 14,
    "criticalZoneCount": 14,
    "recommendedDeploymentCount": 32,
    "cityRiskScore": 92,
    "cityRiskLevel": "critical",
    "deltas": {
      "activeViolations": 18,
      "cityRiskScore": 14,
      "projectedViolations7dPercentage": 12.4
    },
    "generatedAt": "2026-06-19T09:30:00+05:30"
  }
}
```

### `GET /api/v1/violations/timeseries`

Returns time-series data for charts.

Used by:

- Analytics violations by hour chart
- Analytics 7-day trend chart
- Shared dashboard trend charts

Query params:

- `metric`: `violations` or `risk_score`
- `grain`: `hour` or `day`
- `from`, `to`, `window`, `zoneId`, `stationId`, `violationType`

```json
{
  "data": [
    {
      "timestamp": "2026-06-19T08:00:00+05:30",
      "label": "08:00",
      "value": 6,
      "series": "actual"
    },
    {
      "timestamp": "2026-06-19T10:00:00+05:30",
      "label": "10:00",
      "value": 8,
      "series": "actual"
    }
  ]
}
```

For multi-model trend charts:

```json
{
  "data": [
    {
      "date": "2026-06-15",
      "label": "Mon",
      "alpha": 22,
      "beta": 18
    }
  ],
  "meta": {
    "deltaPercentage": 4.2
  }
}
```

### `GET /api/v1/violations/breakdown`

Returns violation distribution by type.

Used by:

- City Risk Map selected-zone violation mix
- Analytics violation breakdown panel

Query params: `from`, `to`, `window`, `zoneId`, `stationId`

```json
{
  "data": [
    {
      "type": "no_parking",
      "label": "No Parking",
      "count": 450,
      "percentage": 45
    },
    {
      "type": "loading_zone",
      "label": "Loading Zone",
      "count": 300,
      "percentage": 30
    }
  ]
}
```

## 3. Forecasts

Forecast APIs provide model predictions, confidence values, and recommended actions.

### `GET /api/v1/forecasts/summary`

Returns top-level forecast metrics.

Used by:

- Prediction Center KPI cards

Query params: `horizonDays`, `zoneId`, `modelVersion`

```json
{
  "data": {
    "horizonDays": 7,
    "projectedViolations": 14285,
    "projectedViolationsDeltaPercentage": 12.4,
    "highRiskZones": 8,
    "monitoredZones": 45,
    "averageModelConfidence": 94.2,
    "automationReady": true,
    "primaryRiskZoneId": "Z-01A",
    "primaryRiskZoneName": "Sector Alpha",
    "generatedAt": "2026-06-19T09:30:00+05:30"
  }
}
```

### `GET /api/v1/forecasts/confidence`

Returns model confidence over time.

Used by:

- Prediction Center confidence trend chart

Query params: `horizonDays`, `zoneId`, `modelVersion`

```json
{
  "data": [
    {
      "date": "2026-06-15",
      "label": "Mon",
      "alpha": 78,
      "beta": 72
    },
    {
      "date": "2026-06-16",
      "label": "Tue",
      "alpha": 82,
      "beta": 75
    }
  ]
}
```

### `GET /api/v1/forecasts`

Returns zone-level forecast rows.

Used by:

- Prediction Center detailed forecast ledger

Query params: `horizonDays`, `zoneId`, `riskLevel`, `page`, `pageSize`, `sort`

```json
{
  "data": [
    {
      "id": "FC-20260619-Z01A",
      "zoneId": "Z-01A",
      "zoneName": "Financial District",
      "estimatedViolations": 450,
      "confidence": 98,
      "riskLevel": "critical",
      "congestionImpact": "severe",
      "recommendedAction": "deploy_unit"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 25,
    "total": 4
  }
}
```

## 4. Forecast Models

Model APIs are for AI model state and lifecycle actions.

### `GET /api/v1/models`

Returns available prediction models.

Used by:

- Prediction Center scenario panel
- Future model selector

```json
{
  "data": [
    {
      "id": "alpha",
      "name": "Model A",
      "description": "Baseline routing",
      "status": "active",
      "version": "2026.06.19-alpha",
      "lastTrainedAt": "2026-06-18T23:00:00+05:30"
    },
    {
      "id": "beta",
      "name": "Model B",
      "description": "What-if max enforcement",
      "status": "candidate",
      "version": "2026.06.19-beta",
      "lastTrainedAt": "2026-06-18T23:15:00+05:30"
    }
  ]
}
```

### `POST /api/v1/models/{modelId}/training-jobs`

Starts model retraining.

Used by:

- Prediction Center `Retrain Model` button

Request:

```json
{
  "trainingWindowDays": 90,
  "includeLiveSensorFeeds": true
}
```

Response:

```json
{
  "data": {
    "jobId": "TRAIN-20260619-001",
    "modelId": "alpha",
    "status": "queued",
    "queuedAt": "2026-06-19T09:33:00+05:30"
  }
}
```

### `GET /api/v1/models/training-jobs/{jobId}`

Returns retraining job status.

```json
{
  "data": {
    "jobId": "TRAIN-20260619-001",
    "modelId": "alpha",
    "status": "running",
    "progressPercentage": 42,
    "startedAt": "2026-06-19T09:34:00+05:30",
    "completedAt": null
  }
}
```

## 5. Scenarios and Simulations

Scenario APIs run what-if calculations without directly changing approved resource plans.

### `GET /api/v1/scenarios`

Returns saved or default scenarios.

Used by:

- Prediction Center Scenario Engine

Query params: `zoneId`, `horizonDays`

```json
{
  "data": [
    {
      "id": "baseline",
      "name": "Status Quo Routing",
      "label": "Model A (Baseline)",
      "status": "active",
      "modelId": "alpha",
      "projectedTotal": 14285
    },
    {
      "id": "max-enforcement",
      "name": "Max Enforcement",
      "label": "Model B (What-If)",
      "status": "draft",
      "modelId": "beta",
      "projectedTotal": 11040
    }
  ]
}
```

### `POST /api/v1/scenario-runs`

Runs a scenario simulation.

Used by:

- Prediction Center `Run Simulation`

Request:

```json
{
  "scenarioId": "max-enforcement",
  "horizonDays": 7,
  "zoneIds": ["Z-01A", "Z-12C"],
  "inputs": {
    "officerCapacity": 115,
    "towTruckCapacity": 27,
    "strategy": "max_enforcement"
  }
}
```

Response:

```json
{
  "data": {
    "runId": "SCN-RUN-20260619-001",
    "scenarioId": "max-enforcement",
    "status": "completed",
    "projectedTotal": 11040,
    "projectedReductionPercentage": 22.7,
    "completedAt": "2026-06-19T09:32:00+05:30"
  }
}
```

## 6. Enforcement Resources

Resource APIs represent officers, tow trucks, and capacity.

### `GET /api/v1/resources/summary`

Returns resource capacity and availability.

Used by:

- Resource Allocation summary cards
- City Risk Map available units card
- Simulation parameter defaults

Query params: `stationId`, `zoneId`, `window`

```json
{
  "data": {
    "totalActiveResources": 142,
    "availableOfficers": 115,
    "availableTowTrucks": 27,
    "availableUnits": 42,
    "activeUnits": 50,
    "projectedCoverage": 94.5,
    "simulatedImpactLabel": "Optimal",
    "expectedViolationReductionPercentage": 28,
    "deltas": {
      "totalActiveResources": 12,
      "projectedCoverage": 2.1
    }
  }
}
```

### `GET /api/v1/resources`

Returns individual resources if the frontend later needs unit-level assignment.

Query params: `type`, `status`, `stationId`, `zoneId`, `page`, `pageSize`

```json
{
  "data": [
    {
      "id": "OFF-1024",
      "type": "officer",
      "status": "available",
      "stationId": "ST-001",
      "currentZoneId": "Z-01A"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 25,
    "total": 142
  }
}
```

## 7. Allocation Plans

Allocation plan APIs manage recommended resource distribution across zones.

### `GET /api/v1/allocation-plans/current`

Returns the current draft or active allocation plan.

Used by:

- Resource Allocation plan table
- Resource Allocation impact prediction

Query params: `planningWindow`, `stationId`, `zoneId`

```json
{
  "data": {
    "id": "PLAN-20260619-001",
    "status": "draft",
    "planningWindow": "today",
    "generatedAt": "2026-06-19T09:30:00+05:30",
    "parameters": {
      "availableOfficers": 115,
      "availableTowTrucks": 27
    },
    "impactMetrics": [
      {
        "id": "congestion-index",
        "label": "Congestion Index",
        "before": 78,
        "after": 58,
        "changePercentage": -15
      },
      {
        "id": "active-violations",
        "label": "Active Violations",
        "before": 68,
        "after": 49,
        "changePercentage": -28
      }
    ],
    "assignments": [
      {
        "zoneId": "Z-01",
        "zoneName": "Downtown Core",
        "displayName": "Downtown Core (Z-01)",
        "detail": "High Congestion Alert",
        "officers": 24,
        "towTrucks": 8,
        "priority": "critical",
        "estimatedReductionPercentage": -42
      }
    ]
  }
}
```

### `POST /api/v1/allocation-plans/simulations`

Creates a simulated allocation plan from user-controlled capacity inputs.

Used by:

- Resource Allocation `Run AI Simulation`

Request:

```json
{
  "planningWindow": "today",
  "availableOfficers": 115,
  "availableTowTrucks": 27,
  "constraints": {
    "maxOfficersPerZone": 24,
    "maxTowTrucksPerZone": 8,
    "includeLowPriorityZones": true
  }
}
```

Response:

```json
{
  "data": {
    "simulationId": "SIM-20260619-001",
    "planId": "PLAN-20260619-002",
    "status": "completed",
    "projectedCoverage": 94.5,
    "expectedViolationReductionPercentage": 28,
    "createdAt": "2026-06-19T09:34:00+05:30"
  }
}
```

### `POST /api/v1/allocation-plans/{planId}/approval`

Approves an allocation plan.

Used by:

- Resource Allocation `Approve Plan`

Request:

```json
{
  "notes": "Approved from NoParkPro dashboard"
}
```

Response:

```json
{
  "data": {
    "planId": "PLAN-20260619-001",
    "status": "approved",
    "approvedAt": "2026-06-19T09:35:00+05:30"
  }
}
```

### `POST /api/v1/allocation-plans/{planId}/revert`

Reverts an allocation plan to the previous active plan.

Used by:

- Resource Allocation `Revert`

Request:

```json
{
  "reason": "Restore previous allocation plan"
}
```

Response:

```json
{
  "data": {
    "activePlanId": "PLAN-20260619-0009",
    "revertedPlanId": "PLAN-20260619-001",
    "status": "active",
    "revertedAt": "2026-06-19T09:36:00+05:30"
  }
}
```

### `GET /api/v1/allocation-plans/{planId}/export`

Exports an allocation plan.

Used by:

- Resource Allocation `Export Plan`

Query params: `format=csv|xlsx|pdf`

For direct downloads, return binary data with `Content-Type` and `Content-Disposition`.

For async exports:

```json
{
  "data": {
    "exportId": "EXP-20260619-001",
    "status": "ready",
    "downloadUrl": "https://backend.example.com/downloads/EXP-20260619-001.csv",
    "expiresAt": "2026-06-19T10:36:00+05:30"
  }
}
```

## 8. Dispatches

Dispatch APIs create and track field-unit dispatches.

### `POST /api/v1/dispatches`

Creates a dispatch request.

Used by:

- City Risk Map `Dispatch`
- Prediction Center forecast action `Deploy Unit`

Request:

```json
{
  "zoneId": "Z-01A",
  "source": "city_risk_map",
  "priority": "critical",
  "recommendedUnits": {
    "officers": 4,
    "towTrucks": 1
  },
  "reason": "High predicted parking violation risk"
}
```

Response:

```json
{
  "data": {
    "id": "DSP-20260619-0001",
    "status": "queued",
    "zoneId": "Z-01A",
    "createdAt": "2026-06-19T09:31:00+05:30"
  }
}
```

### `GET /api/v1/dispatches`

Returns dispatches.

Query params: `status`, `zoneId`, `from`, `to`, `page`, `pageSize`

```json
{
  "data": [
    {
      "id": "DSP-20260619-0001",
      "status": "queued",
      "zoneId": "Z-01A",
      "priority": "critical",
      "createdAt": "2026-06-19T09:31:00+05:30"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 25,
    "total": 1
  }
}
```

## 9. System Settings

Settings are not fully designed in the frontend yet, but the route exists.

### `GET /api/v1/settings`

Returns system settings.

```json
{
  "data": {
    "timezone": "Asia/Calcutta",
    "defaultPlanningWindow": "today",
    "alertThresholds": {
      "criticalRiskScore": 90,
      "highRiskScore": 75
    },
    "notifications": {
      "email": true,
      "dashboard": true
    }
  }
}
```

### `PATCH /api/v1/settings`

Updates system settings.

Request:

```json
{
  "timezone": "Asia/Calcutta",
  "defaultPlanningWindow": "today",
  "alertThresholds": {
    "criticalRiskScore": 90,
    "highRiskScore": 75
  },
  "notifications": {
    "email": true,
    "dashboard": true
  }
}
```

Response:

```json
{
  "data": {
    "updated": true,
    "updatedAt": "2026-06-19T09:37:00+05:30"
  }
}
```

## Frontend Consumption Map

This is only a mapping guide for frontend integration. It is not the API structure.

### City Risk Map

- `GET /zones`
- `GET /zones/hotspots`
- `GET /zones/risk-map`
- `GET /violations/summary`
- `GET /violations/breakdown`
- `GET /resources/summary`
- `POST /dispatches`

### Analytics

- `GET /violations/summary`
- `GET /violations/timeseries`
- `GET /violations/breakdown`
- `GET /zones/hotspots`
- `GET /zones/risk-map`

### Prediction Center

- `GET /forecasts/summary`
- `GET /forecasts/confidence`
- `GET /forecasts`
- `GET /models`
- `POST /models/{modelId}/training-jobs`
- `GET /scenarios`
- `POST /scenario-runs`
- `POST /dispatches`

### Resource Allocation

- `GET /resources/summary`
- `GET /allocation-plans/current`
- `POST /allocation-plans/simulations`
- `POST /allocation-plans/{planId}/approval`
- `POST /allocation-plans/{planId}/revert`
- `GET /allocation-plans/{planId}/export`

### Settings

- `GET /settings`
- `PATCH /settings`

## Suggested Backend MVP

Implement these first to replace the current mock data:

1. `GET /api/v1/zones/hotspots`
2. `GET /api/v1/zones/risk-map`
3. `GET /api/v1/violations/summary`
4. `GET /api/v1/violations/timeseries`
5. `GET /api/v1/violations/breakdown`
6. `GET /api/v1/forecasts/summary`
7. `GET /api/v1/forecasts/confidence`
8. `GET /api/v1/forecasts`
9. `GET /api/v1/resources/summary`
10. `GET /api/v1/allocation-plans/current`

Then add mutation endpoints for dispatches, simulations, approvals, reverts, exports, and model retraining.
