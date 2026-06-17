import { AlertTriangle, Crosshair, ShieldCheck } from "lucide-react";

export const executiveKpis = [
  {
    label: "Overall City Risk Level",
    value: "Critical",
    detail: "92/100",
    subdetail: "+14 pts VS baseline",
    tone: "border-t-error",
    icon: AlertTriangle,
  },
  {
    label: "Critical Zones Today",
    value: "14",
    detail: "Downtown Core Sector 7",
    subdetail: "North Stadium Arterial",
    tone: "border-t-tertiary",
    icon: Crosshair,
  },
  {
    label: "Recommended Deployments",
    value: "32",
    detail: "↓ 4 units",
    subdetail: "Optimal coverage met",
    tone: "border-t-primary",
    icon: ShieldCheck,
  },
];

export const hotspots = [
  { label: "Downtown Sector 7", value: 245, color: "bg-error" },
  { label: "North Stadium Arterial", value: 182, color: "bg-tertiary" },
  { label: "Westside Commercial Loop", value: 134, color: "bg-primary" },
  { label: "Transit Hub Alpha", value: 98, color: "bg-primary-fixed-dim" },
];

export const breakdown = [
  { label: "No Parking", value: "45%", color: "bg-primary" },
  { label: "Loading Zone", value: "30%", color: "bg-tertiary" },
  { label: "Fire Lane", value: "20%", color: "bg-error" },
  { label: "Other", value: "5%", color: "bg-surface-container-high" },
];
