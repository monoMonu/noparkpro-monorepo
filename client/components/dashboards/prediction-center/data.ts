import { CalendarDays, Filter, RefreshCcw } from "lucide-react";

export const toolbarActions = [
  { label: "Next 7 Days", icon: CalendarDays, variant: "secondary" as const },
  { label: "Retrain Model", icon: RefreshCcw, variant: "default" as const },
];

export const filterIcon = Filter;
