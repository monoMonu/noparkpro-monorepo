import { redirect } from "next/navigation";

export default function DashboardIndexPage() {
  redirect("/dashboard/resource-allocation");
}