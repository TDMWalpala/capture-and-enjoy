import { Skeleton } from "@/components/ui/skeleton";

export function TaskListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="surface-panel flex items-start gap-4 p-4">
          <Skeleton className="size-5 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-24 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="surface-panel space-y-3 p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-10" />
          </div>
        ))}
      </div>
      <TaskListSkeleton rows={3} />
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading activity">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
