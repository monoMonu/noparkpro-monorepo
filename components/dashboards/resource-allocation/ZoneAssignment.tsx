"use client";

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Download } from 'lucide-react'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import type { AllocationPlan, RiskLevel } from '@/lib/api'
import { exportToCSV } from '@/lib/utils'

type Assignment = AllocationPlan["assignments"][number]

function titleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase())
}

function badgeTone(priority: RiskLevel) {
  if (priority === "critical") {
    return "critical"
  }
  if (priority === "elevated") {
    return "elevated"
  }
  if (priority === "routine") {
    return "routine"
  }
  return "muted"
}

const ZoneAssignment = ({ assignments }: { assignments: Assignment[] }) => {
  const [showAll, setShowAll] = React.useState(false);
  const visibleAssignments = showAll ? assignments : assignments.slice(0, 5);

  const handleExportCSV = () => {
    const headers = [
      { key: 'zoneId' as const, label: 'Zone ID' },
      { key: 'zoneName' as const, label: 'Zone Name' },
      { key: 'officers' as const, label: 'Officers' },
      { key: 'towTrucks' as const, label: 'Tow Trucks' },
      { key: 'priority' as const, label: 'Priority' },
      { key: 'estimatedReductionPercentage' as const, label: 'Estimated Reduction (%)' }
    ];
    exportToCSV(assignments, 'zone_assignments.csv', headers);
  };

  return (
    <Card className="h-[580px] flex flex-col overflow-hidden">
      <CardHeader className="flex-shrink-0">
        <div>
          <CardTitle>AI Zone Assignments</CardTitle>
          <CardDescription>Recommended deployment spread for the current planning window.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-primary" onClick={handleExportCSV}>
          <Download className="h-4 w-4" /> Export Plan
        </Button>
      </CardHeader>
      <div className="overflow-auto flex-1 min-h-0">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-container-low text-[11px] uppercase tracking-[0.22em] text-on-surface-variant sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 font-medium">Zone Sector</th>
              <th className="px-4 py-3 font-medium">Officers</th>
              <th className="px-4 py-3 font-medium">Tow Trucks</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Est. Reduction</th>
            </tr>
          </thead>
          <tbody>
            {visibleAssignments.map((zone) => (
              <tr key={zone.zoneId} className="border-t border-outline-variant/70">
                <td className="px-4 py-4 align-top">
                  <div className="font-medium text-on-surface">{zone.displayName}</div>
                  <div className="mt-1 text-xs text-on-surface-variant">{zone.detail}</div>
                </td>
                <td className="px-4 py-4 align-top text-on-surface">{zone.officers}</td>
                <td className="px-4 py-4 align-top text-on-surface">{zone.towTrucks}</td>
                <td className="px-4 py-4 align-top">
                  <Badge tone={badgeTone(zone.priority)}>{titleCase(zone.priority)}</Badge>
                </td>
                <td className="px-4 py-4 align-top text-on-surface-variant">{zone.estimatedReductionPercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CardFooter className="flex items-center justify-between text-sm text-on-surface-variant flex-shrink-0 border-t border-outline-variant/50 py-3">
        <span>{showAll ? `Showing all ${assignments.length} zones` : `Showing top ${Math.min(5, assignments.length)} zones prioritized by AI`}</span>
        {assignments.length > 0 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
          >
            {showAll ? "View Less" : "View All Zones"}
          </button>
        )}
      </CardFooter>
    </Card>
  )
}

export default ZoneAssignment
