"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

import type { ForecastConfidencePoint } from "@/lib/api";

export function ConfidenceChart({ data }: { data: ForecastConfidencePoint[] }) {
  return (
    <div className="h-[400px] min-h-0 min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
          <CartesianGrid stroke="var(--outline-variant)" strokeOpacity={0.55} vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            interval={"preserveStartEnd"}
            padding={{ left: 65, right: 65 }}
            tick={{ fill: "var(--on-surface-variant)", fontSize: 12, fontFamily: "var(--font-code)" }}
          />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} tick={{ fill: "var(--on-surface-variant)", fontSize: 12 }} width={44} />
          <Area type="monotone" dataKey="alpha" stroke="var(--primary)" strokeWidth={3} fill="var(--primary)" fillOpacity={0.08} />
          <Area type="monotone" dataKey="beta" stroke="var(--tertiary)" strokeWidth={2} fill="var(--tertiary)" fillOpacity={0.04} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
