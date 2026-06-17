"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import { trendData, violationBars } from "@/data/dashboard";

type TrendChartProps = {
  compact?: boolean;
};

export function TrendChart({ compact = false }: TrendChartProps) {
  return (
    <div className={cn("h-[260px] w-full", compact && "h-[220px]") }>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData} margin={{ top: 10, right: 6, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.28} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--outline-variant)" strokeOpacity={0.45} vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--on-surface-variant)", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--on-surface-variant)", fontSize: 12 }} width={36} />
          <Tooltip
            cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "4 4" }}
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--outline-variant)",
              borderRadius: 8,
              boxShadow: "0 16px 32px rgba(15, 23, 42, 0.10)",
            }}
          />
          <Area
            type="monotone"
            dataKey="alpha"
            stroke="var(--primary)"
            strokeWidth={3}
            fill="url(#trendFill)"
          />
          <Area type="monotone" dataKey="beta" stroke="var(--outline)" strokeOpacity={0.45} fillOpacity={0} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ViolationsChart() {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={violationBars} margin={{ top: 8, right: 0, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="var(--outline-variant)" strokeOpacity={0.35} vertical={false} />
          <XAxis dataKey="slot" axisLine={false} tickLine={false} tick={{ fill: "var(--on-surface-variant)", fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--on-surface-variant)", fontSize: 11 }} width={26} />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--outline-variant)",
              borderRadius: 8,
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--primary)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}