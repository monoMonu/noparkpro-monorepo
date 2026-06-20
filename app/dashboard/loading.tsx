export default function DashboardLoading() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-36 animate-pulse rounded-lg border border-outline-variant bg-surface-container-low"
        />
      ))}
    </div>
  );
}
