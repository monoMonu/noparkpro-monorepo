"use client";

import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard data unavailable</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="max-w-2xl text-sm text-on-surface-variant">
          {error.message || "The dashboard could not load live API data."}
        </p>
        <Button type="button" onClick={reset}>
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
