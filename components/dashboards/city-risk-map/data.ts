import { AlertTriangle, Bus, Car, ChartNoAxesColumnIncreasing, ParkingCircle } from "lucide-react";

export const cityStats = [
  { label: "Total Active", value: "1,248", delta: "↑ 18", tone: "border-t-primary", icon: ParkingCircle },
  { label: "Predicted 24h", value: "3,105", delta: "Baseline", tone: "border-t-tertiary", icon: ChartNoAxesColumnIncreasing },
  { label: "High Risk Zones", value: "14", delta: "↑ 2", tone: "border-t-error", icon: AlertTriangle },
  { label: "Available Units", value: "42", delta: "/ 50 Active", tone: "border-t-tertiary", icon: Bus },
];

export const activeHotspots = [
  { rank: "#1", zone: "Fin. District", detail: "Est. 120 violations", score: "98/100", badge: "Critical", color: "border-l-error bg-surface-container" },
  { rank: "#2", zone: "Port Area", detail: "Est. 85 Violations", score: "75/100", badge: "High", color: "border-l-tertiary" },
  { rank: "#3", zone: "Stadium North", detail: "Event pending", score: "62/100", badge: "Elevated", color: "border-l-primary" },
  { rank: "#4", zone: "Midtown Res.", detail: "Routine monitoring", score: "34/100", badge: "", color: "border-l-outline" },
];

export const riskMix = [
  { label: "Double Parking", value: 45, color: "bg-error" },
  { label: "Loading Zone Blocked", value: 30, color: "bg-tertiary" },
  { label: "Fire Hydrant", value: 15, color: "bg-primary" },
];

export const filters = ["Today", "All Stations", "All Violations"];

export const mapPins = [
  "left-[38%] top-[31%] border-error bg-error/10 shadow-[0_0_34px_rgba(186,26,26,0.45)]",
  "left-[63%] top-[62%] border-tertiary bg-surface shadow-[0_0_34px_rgba(80,95,118,0.25)]",
  "left-[54%] top-[82%] border-primary bg-primary/10 shadow-[0_0_34px_rgba(0,74,198,0.3)]",
];

export const mapIcon = Car;
