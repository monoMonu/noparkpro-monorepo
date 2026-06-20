import ResourceAllocation from '@/components/dashboards/resource-allocation/Dashboard'
import { getCurrentAllocationPlan, getResourcesSummary } from '@/lib/api'
import React from 'react'

export const dynamic = "force-dynamic";

const ResourceAllocationPage = async () => {
  const [resourcesSummary, allocationPlan] = await Promise.all([
    getResourcesSummary({ window: "today" }),
    getCurrentAllocationPlan({ planningWindow: "today" }),
  ]);

  return (
    <ResourceAllocation resourcesSummary={resourcesSummary.data} allocationPlan={allocationPlan.data} />
  )
}

export default ResourceAllocationPage
