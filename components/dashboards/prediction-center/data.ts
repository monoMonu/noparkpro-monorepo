import { AlertTriangle, CalendarDays, Cpu, Filter, RefreshCcw, TrendingUp } from "lucide-react";

export const forecastCards = [
  {
    label: "Projected Violations",
    value: "14,285",
    delta: "↑12.4%",
    detail: "Expected next 7 days based on current trajectory.",
    tone: "border-t-error",
    icon: TrendingUp,
  },
  {
    label: "High Risk Zones Detected",
    value: "08",
    delta: "/ 45 Monitored",
    detail: "Sector Alpha requires immediate intervention.",
    tone: "border-t-tertiary",
    icon: AlertTriangle,
  },
  {
    label: "Avg Model Confidence",
    value: "94.2%",
    delta: "Stable",
    detail: "Ready for automated routing.",
    tone: "border-t-tertiary",
    icon: Cpu,
  },
];

export const confidenceData = [
  { day: "Mon", alpha: 78, beta: 72 },
  { day: "Tue", alpha: 82, beta: 75 },
  { day: "Wed", alpha: 80, beta: 77 },
  { day: "Thu", alpha: 89, beta: 83 },
  { day: "Fri", alpha: 86, beta: 81 },
  { day: "Sun", alpha: 94, beta: 88 },
  { day: "Next Tue", alpha: 92, beta: 84 },
];

export const ledger = [
  { zone: "Z-01A Financial District", violations: 450, confidence: "98%", risk: "Critical", impact: "Severe", action: "Deploy Unit" },
  { zone: "Z-12C Stadium Environs", violations: 312, confidence: "92%", risk: "Elevated", impact: "Moderate", action: "Monitor" },
  { zone: "Z-05B Waterfront North", violations: 85, confidence: "88%", risk: "Nominal", impact: "Low", action: "Automated" },
  { zone: "Z-09A Tech Corridor", violations: 120, confidence: "64%", risk: "Nominal", impact: "Low", action: "Automated" },
];

export const toolbarActions = [
  { label: "Next 7 Days", icon: CalendarDays, variant: "secondary" as const },
  { label: "Retrain Model", icon: RefreshCcw, variant: "default" as const },
];

export const filterIcon = Filter;
