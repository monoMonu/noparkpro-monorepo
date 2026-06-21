"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FilterBar({
  windowVal,
  onWindowChange,
  stationVal,
  onStationChange,
  violationVal,
  onViolationChange,
  stations,
  violationTypes,
}: {
  windowVal: string;
  onWindowChange: (w: string) => void;
  stationVal: string;
  onStationChange: (s: string) => void;
  violationVal: string;
  onViolationChange: (v: string) => void;
  stations: string[];
  violationTypes: { type: string; label: string }[];
}) {
  const [openDropdown, setOpenDropdown] = useState<"window" | "station" | "violation" | null>(null);

  // Close dropdown on click outside
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const windowLabelMap: Record<string, string> = {
    today: "Today",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
  };

  const getStationLabel = () => {
    return stationVal || "All Stations";
  };

  const getViolationLabel = () => {
    if (!violationVal) return "All Violations";
    const found = violationTypes.find(v => v.type === violationVal);
    return found ? found.label : violationVal;
  };

  return (
    <div ref={containerRef} className="mb-6 flex flex-wrap items-center gap-3">
      <div className="mr-2 text-base font-semibold text-primary">NoParkPro</div>
      <div className="flex-1"></div>
      {/* Time Window Dropdown */}
      <div className="relative">
        <Button
          variant="secondary"
          className="h-9 min-w-32 justify-between gap-2 text-left"
          onClick={() => setOpenDropdown(openDropdown === "window" ? null : "window")}
        >
          <span>{windowLabelMap[windowVal] || "Today"}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
        {openDropdown === "window" && (
          <div className="absolute left-0 mt-1 z-50 min-w-40 rounded-md border border-outline-variant bg-surface py-1 shadow-lg">
            {Object.entries(windowLabelMap).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-surface-container-low transition-colors"
                onClick={() => {
                  onWindowChange(key);
                  setOpenDropdown(null);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Station Dropdown */}
      <div className="relative">
        <Button
          variant="secondary"
          className="h-9 min-w-32 justify-between gap-2 text-left"
          onClick={() => setOpenDropdown(openDropdown === "station" ? null : "station")}
        >
          <span>{getStationLabel()}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
        {openDropdown === "station" && (
          <div className="absolute left-0 mt-1 z-50 max-h-60 overflow-y-auto min-w-48 rounded-md border border-outline-variant bg-surface py-1 shadow-lg">
            <button
              type="button"
              className="flex w-full items-center px-3 py-2 text-left text-sm font-medium hover:bg-surface-container-low transition-colors"
              onClick={() => {
                onStationChange("");
                setOpenDropdown(null);
              }}
            >
              All Stations
            </button>
            {stations.map((station) => (
              <button
                key={station}
                type="button"
                className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-surface-container-low transition-colors"
                onClick={() => {
                  onStationChange(station);
                  setOpenDropdown(null);
                }}
              >
                {station}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Violation Type Dropdown */}
      {/* <div className="relative">
        <Button
          variant="secondary"
          className="h-9 min-w-32 justify-between gap-2 text-left"
          onClick={() => setOpenDropdown(openDropdown === "violation" ? null : "violation")}
        >
          <span>{getViolationLabel()}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
        {openDropdown === "violation" && (
          <div className="absolute left-0 mt-1 z-50 max-h-60 overflow-y-auto min-w-56 rounded-md border border-outline-variant bg-surface py-1 shadow-lg">
            <button
              type="button"
              className="flex w-full items-center px-3 py-2 text-left text-sm font-medium hover:bg-surface-container-low transition-colors"
              onClick={() => {
                onViolationChange("");
                setOpenDropdown(null);
              }}
            >
              All Violations
            </button>
            {violationTypes.map((v) => (
              <button
                key={v.type}
                type="button"
                className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-surface-container-low transition-colors"
                onClick={() => {
                  onViolationChange(v.type);
                  setOpenDropdown(null);
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
}
