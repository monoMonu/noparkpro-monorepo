# NoParkPro AI

AI-driven illegal parking hotspot detection and traffic impact quantification for Bangalore.

> Note: Prototype Server is deployed on render free tier so it may take upto 1 minute to spin.
Live at: https://no-park-pro.vercel.app/


## ⚙️ Setup Guide

### 1. Prerequisites
* **Python**: v3.9 to v3.11 is recommended.
* **Pip**: Make sure Python package installer is installed.

### 2. Installation
It is recommended to run the server inside a Python virtual environment:
```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

Next, install all required dependencies:
```bash
pip install -r requirements.txt
```
---

## ⚡ Running the Pipeline

```bash
# 1. Generate hotspot clusters from raw violations
python ai/cluster.py

# 2. Build behavioral profiles per cluster
python ai/temporal.py

# 3. Engineer training features
python ai/features.py

# 4. Train and validate the model
python ai/train.py

# 5. (optional) Generate a static prediction snapshot
python ai/predict.py

# 6. (optional) Build supplementary analytics
python additional/kpi_dashboard.py
python additional/trend_analysis.py
python additional/repeat_offenders.py
python additional/monthly_hotspots.py

# 7. Shrink the clustered dataset for deployment
python trim_violations_clustered.py

# 8. Start the server
python app.py
```

> Frontend Setup Guide: [Click here](https://github.com/monoMonu/noparkpro-monorepo/blob/main/client/README.md)

## Problem Statement

> On-street illegal parking and spillover parking near commercial areas, metro stations, and events choke carriageways and intersections. Enforcement today is patrol-based and reactive, with no heatmap of parking violations vs. congestion impact and no way to prioritize enforcement zones.
>
> **How can AI-driven parking intelligence detect illegal parking hotspots and quantify their impact on traffic flow to enable targeted enforcement?**

## What This Does

NoParkPro AI processes 298,450 raw parking violation records from Bangalore (Nov 2023–Apr 2024) into:

1. **364 street-level hotspot clusters**, detected via DBSCAN spatial clustering on violation coordinates (150m radius) — not coarse police-station-zone aggregation.
2. **Next-day violation forecasts per cluster**, via an XGBoost model trained on lag/temporal features, validated with 5-fold time-series cross-validation (R² 0.944 vs. 0.937 baseline).
3. **A traffic Impact Score (0–100)** per cluster, weighted by predicted volume, traffic-blocking violation ratio, main-road/double-parking severity, and peak-hour activity.
4. **Concrete enforcement recommendations** — officer and tow-truck counts per cluster, ranked by priority.
5. **Supporting intelligence**: week-over-week trend detection, repeat-offender analysis, and historical month-by-month hotspot evolution.

All served through a versioned REST API (`/api/v1/`) powering a Next.js dashboard frontend.

## Architecture

```
violations.csv (298,450 raw records)
        │
        ▼
┌───────────────┐
│  cluster.py   │  DBSCAN spatial clustering → 364 hotspots
└───────────────┘
        │
        ▼
┌───────────────┐
│  temporal.py  │  Per-cluster hour/day/peak/rush-hour profiles
└───────────────┘
        │
        ▼
┌───────────────┐
│  features.py  │  Lag features, rolling averages, temporal joins,
│               │  target construction (next-day violations)
└───────────────┘
        │
        ▼
┌───────────────┐
│   train.py    │  XGBoost training + 5-fold TimeSeriesSplit CV
│               │  vs. 7-day moving-average baseline
└───────────────┘
        │
        ▼
┌───────────────┐
│  predict.py   │  Daily inference, impact scoring, risk ranking,
│               │  resource recommendation
└───────────────┘
        │
        ▼
┌───────────────┐
│    app.py     │  Flask REST API (/api/v1/*)
└───────────────┘
        │
        ▼
   Next.js frontend (4 live dashboards)
```

## Project Structure

```
noparkpro-ml/
├── ai/                          Core ML pipeline
│   ├── cluster.py               DBSCAN spatial clustering on raw coordinates
│   ├── temporal.py               Per-cluster time-of-day/week behavioral profiles
│   ├── features.py              Lag features, rolling averages, target construction
│   ├── train.py                  XGBoost training, cross-validation, baseline comparison
│   └── predict.py                Inference, impact scoring, risk ranking, recommendations
│
├── additional/                  Supplementary analytics (KPI dashboard, repeat offenders, trends)
│   ├── kpi_dashboard.py          City-wide KPI aggregation (hourly/daily/monthly patterns)
│   ├── monthly_hotspots.py       Month-by-month historical cluster replay
│   ├── repeat_offenders.py       Vehicle-level repeat violation analysis (privacy-masked)
│   └── trend_analysis.py         Week-over-week worsening/improving cluster detection
│
├── data/                        Generated datasets (see Data Files below)
├── models/                      Trained model artifacts (.pkl)
├── app.py                       Flask REST API — all dashboard endpoints
├── trim_violations_clustered.py  One-off utility: shrinks violations_clustered.csv for deployment
└── requirements.txt
```

## Pipeline Stages

### 1. `ai/cluster.py` — Spatial Hotspot Detection

Runs DBSCAN (haversine metric, 150m radius, min 10 violations) directly on `latitude`/`longitude` from raw violations. Produces:
- `data/clusters.csv` — 364 clusters with centroid coordinates, total/blocking violation counts, blocking ratio, peak hour, dominant police station
- `data/violations_clustered.csv` — every violation record labeled with its `cluster_id`

This is the core differentiator: detection happens at street-level precision, not administrative zone boundaries.

### 2. `ai/temporal.py` — Behavioral Profiling

For each cluster, computes normalized hourly/daily violation distributions, peak hour/day, night-vs-day dominance, weekend dominance, and rush-hour ratio (violations during 7-9am/5-7pm vs. total).

Output: `data/cluster_temporal.csv`

### 3. `ai/features.py` — Feature Engineering

Builds the cluster-day-level training dataset: daily violation counts, blocking-type breakdowns, lag features (`lag_1`, `lag_3_avg`, `lag_7_avg`), temporal joins, and the next-day target. Critically, this stage was specifically audited and fixed to **remove data leakage** — early iterations accidentally included full-history aggregates (`window_*` columns, `cluster_avg_violations`) that leaked future information into training rows.

Output: `data/cluster_features.csv`

### 4. `ai/train.py` — Model Training & Validation

Trains an XGBoost regressor with early stopping, 5-fold `TimeSeriesSplit` cross-validation, and explicit comparison against a 7-day moving-average baseline on every fold. Regularization (`max_depth=4`, `min_child_weight=5`, `reg_alpha=0.5`, `reg_lambda=2.0`) was tuned after an initial overfit run (Train R² 0.95 vs. Val R² 0.58) was caught and corrected.

**Final validated performance**: Avg R² 0.944 (Std 0.018) vs. baseline R² 0.937 — a real, modest, honestly-reported improvement.

Outputs: `models/cluster_violation_predictor.pkl`, `models/cluster_mapping.pkl`, `models/feature_names.pkl`

### 5. `ai/predict.py` — Inference & Scoring

Loads the trained model once at import time (memory-optimized after a production OOM issue on Render's free tier), recomputes lag features from the latest data, and produces per-cluster:
- `predicted_violations_raw` — uncapped next-day forecast (used for display)
- `predicted_violations` — P95-capped version (used internally for risk/impact scoring, prevents one anomalous cluster from skewing all rankings)
- `impact_score` (0–100) — weighted: 45% predicted volume, 25% blocking ratio, 15% main-road parking, 10% double parking, 5% peak-hour activity
- `risk_level` — HIGH/MEDIUM/LOW via data-driven P75/P90 percentile thresholds (not hardcoded)
- `lane_obstruction_index` — traffic-blocking severity estimate, normalized against 7-day rolling average
- `recommended_officers` / `recommended_tow_trucks` — resource allocation by impact-score threshold
- `reasons` — human-readable explanation array (e.g. "72% of violations directly block traffic", "Trend worsening by 28% this week") for explainability

Also callable standalone (`python ai/predict.py`) to regenerate `data/hotspot_predictions.csv`.

### 6. `additional/` — Supplementary Analytics

- **`kpi_dashboard.py`** — city-wide aggregates: hourly/daily/monthly violation trends, top junctions/zones, vehicle-type and violation-type distributions, approval/SCITA-sent rates → `data/kpi_dashboard.json`
- **`trend_analysis.py`** — compares each cluster's 3-day vs. 7-day rolling average to flag `worsening`/`stable`/`improving` trends (±15% threshold) → `data/cluster_trends.csv`
- **`repeat_offenders.py`** — vehicles with 5+ violations, their dominant zone/violation type/vehicle type; vehicle numbers are masked for privacy → `data/repeat_offenders.csv`, `data/zone_repeat_offenders.csv`
- **`monthly_hotspots.py`** — re-runs DBSCAN independently per calendar month to show how hotspot geography evolved Nov 2023–Apr 2024 → `data/monthly_hotspots.json`

### 7. `app.py` — REST API

Flask backend exposing versioned endpoints under `/api/v1/`, following a consistent `{ "data": ..., "meta": ... }` / `{ "error": ... }` response contract. Endpoints are cached (5-minute TTL) and error-wrapped so a missing file returns a clean JSON 500 instead of a crash.

| Endpoint | Purpose |
|---|---|
| `GET /api/v1/zones` | Paginated, filterable list of all clusters |
| `GET /api/v1/zones/{zoneId}` | Single cluster detail |
| `GET /api/v1/zones/hotspots` | Top-N ranked hotspots |
| `GET /api/v1/zones/risk-map` | Map-ready data: lat/lng, risk score, density |
| `GET /api/v1/violations/summary` | City-wide active/predicted violation totals |
| `GET /api/v1/violations/timeseries` | Hourly or monthly violation volume |
| `GET /api/v1/violations/breakdown` | Violation type distribution |
| `GET /api/v1/forecasts/summary` | Next-day forecast totals, top risk zone |
| `GET /api/v1/forecasts/confidence` | Real 5-fold CV results (model vs. baseline R²) |
| `GET /api/v1/forecasts` | Per-cluster forecast ledger with recommended actions |
| `GET /api/v1/models` | Model registry (honest: one trained model, one baseline) |
| `GET /api/v1/resources/summary` | City-wide officer/tow-truck recommendation totals |
| `GET /api/v1/allocation-plans/current` | Top-5 priority zones with resource assignments |
| `GET /api/v1/health` | Model load status, cluster count, cache age |

**Design note on honesty**: any field that is an illustrative assumption rather than a direct model/data output (e.g. 7-day projection decay, simulation "what-if" deltas) carries an explicit `meta.note` explaining the assumption — visible directly in the API response, not buried in code comments.

**Not implemented** (would require persistent state/database, out of scope for this build): plan approval/revert/export, dispatch creation/tracking, training-job orchestration, settings persistence. See inline docstring in `app.py` for the full list and what each would require.

## Data Files

| File | Generated by | Used by live API? |
|---|---|---|
| `violations.csv` | (raw input) | No — only offline pipeline scripts |
| `violations_clustered.csv` | `cluster.py` | No — superseded by slim version |
| `violations_clustered_slim.csv` | `trim_violations_clustered.py` | **Yes** — required at runtime |
| `clusters.csv` | `cluster.py` | **Yes** |
| `cluster_temporal.csv` | `temporal.py` | **Yes** |
| `cluster_features.csv` | `features.py` | No — training only |
| `cluster_trends.csv` | `trend_analysis.py` | **Yes** |
| `kpi_dashboard.json` | `kpi_dashboard.py` | **Yes** |
| `hotspot_predictions.csv` | `predict.py` (standalone run) | No — API recomputes fresh per request |
| `repeat_offenders*.csv/.json` | `repeat_offenders.py` | Optional endpoints only |
| `monthly_hotspots.json` | `monthly_hotspots.py` | Optional endpoints only |
| `trend_summary.json` | `trend_analysis.py` | Optional endpoints only |

`models/*.pkl` (trained model, cluster mapping, feature names) are required at runtime and loaded once at process startup.

## Tech Stack

- **Data processing**: Python, pandas, NumPy
- **Clustering**: scikit-learn DBSCAN (haversine metric)
- **Forecasting**: XGBoost, scikit-learn TimeSeriesSplit
- **Backend**: Flask, Flask-CORS
- **Frontend**: Next.js, React, Tailwind, Recharts
- **Deployment**: Render (backend), Vercel (frontend)

The API reads `data/violations_clustered_slim.csv`, `data/cluster_temporal.csv`, `data/clusters.csv`, `data/cluster_trends.csv`, and `data/kpi_dashboard.json` at runtime — steps 1–4 and 7 (plus `trend_analysis.py` and `kpi_dashboard.py` from step 6) must be run at least once before starting the API.

## Key Design Decisions

1. **Street-level clustering over zone aggregation** — the core technical differentiator. 364 precise hotspots vs. 54 coarse police-station zones.
2. **Honest model validation** — every reported metric is a real cross-validation result against a real baseline, including an initial overfitting issue (Train R² 0.95 / Val R² 0.58) that was caught and fixed via regularization and early stopping.
3. **No fabricated precision** — traffic impact has no ground-truth sensor data, so the Impact Score is built as a transparent, violation-type-weighted heuristic rather than a falsely precise "percentage of lane blocked" claim.
4. **Explainability by default** — every hotspot prediction includes a `reasons` array stating why it's ranked the way it is.
5. **Production-aware engineering** — caching to handle concurrent dashboard load, a documented and fixed memory-leak/OOM issue on deployment, privacy-masked vehicle numbers in repeat-offender data, and explicit API-level disclosure of every illustrative (non-measured) field.
