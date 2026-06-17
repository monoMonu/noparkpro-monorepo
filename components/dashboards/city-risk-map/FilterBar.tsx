import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { filters } from "./data";

export function FilterBar() {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="mr-2 text-3xl font-bold text-primary">NoParkPro</div>
      <div className="hidden h-8 w-px bg-outline-variant sm:block" />
      {filters.map((filter) => (
        <Button key={filter} variant="secondary" className="h-9 min-w-32 justify-between">
          {filter}
          <ChevronDown className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}
