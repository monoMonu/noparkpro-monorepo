import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ViolationBreakdownItem } from '@/lib/api';
import React from 'react'

const breakdownTones = ["primary", "secondary", "error", "muted"];

const ViolationBreakdown = ({ breakdown }: { breakdown: ViolationBreakdownItem[]; }) => {
  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div>
            <CardTitle>Violation Breakdown</CardTitle>
            <CardDescription>Breakdown of violations by type</CardDescription>
          </div>
          <div className="h-5 w-5 rounded-full border border-outline-variant" />
        </CardHeader>
        <CardContent className="space-y-4">
          {breakdown.map((item, index) => {
            const tone = breakdownTones[index] ?? "muted";

            return (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      tone === "primary"
                        ? "h-2.5 w-2.5 rounded-full bg-primary"
                        : tone === "secondary"
                          ? "h-2.5 w-2.5 rounded-full bg-secondary"
                          : tone === "error"
                            ? "h-2.5 w-2.5 rounded-full bg-error"
                            : "h-2.5 w-2.5 rounded-full bg-outline-variant"
                    }
                  />
                  <span className="text-on-surface">{item.label}</span>
                </div>
                <span className="text-on-surface-variant">{item.percentage}%</span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </>
  )
}

export default ViolationBreakdown