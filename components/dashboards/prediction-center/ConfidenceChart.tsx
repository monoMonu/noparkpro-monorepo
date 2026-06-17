"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { confidenceData } from "./data";

export function ConfidenceChart() {
  return (
    <div className="h-[310px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={confidenceData} margin={{ top: 10, right: 4, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="var(--outline-variant)" strokeOpacity={0.55} vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--on-surface-variant)", fontSize: 12, fontFamily: "var(--font-code)" }} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} tick={{ fill: "var(--on-surface-variant)", fontSize: 12 }} width={44} />
          <Area type="monotone" dataKey="alpha" stroke="var(--primary)" strokeWidth={3} fill="var(--primary)" fillOpacity={0.08} />
          <Area type="monotone" dataKey="beta" stroke="var(--tertiary)" strokeWidth={2} fill="var(--tertiary)" fillOpacity={0.04} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
