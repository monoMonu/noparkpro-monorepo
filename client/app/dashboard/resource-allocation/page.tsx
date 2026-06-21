import ResourceAllocation from '@/components/dashboards/resource-allocation/Dashboard'
import { getCurrentAllocationPlan, getResourcesSummary } from '@/lib/api'
import React from 'react'

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const ResourceAllocationPage = async (props: {
  searchParams: SearchParams;
}) => {
  const searchParams = await props.searchParams;
  const windowParam = (searchParams.window as string) || "today";

  const [resourcesSummary, allocationPlan] = await Promise.all([
    getResourcesSummary({ window: windowParam as any }),
    getCurrentAllocationPlan({ planningWindow: windowParam }),
  ]);

  return (
    <ResourceAllocation 
      initialResourcesSummary={resourcesSummary.data} 
      initialAllocationPlan={allocationPlan.data} 
      initialFilters={{ window: windowParam }}
    />
  )
}

export default ResourceAllocationPage
