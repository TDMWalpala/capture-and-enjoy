import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";
import { useMemo } from "react";
import { ActivityItem } from "@/components/activity/ActivityItem";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { ActivitySkeleton } from "@/components/common/Skeletons";
import { useActivity } from "@/hooks/useActivity";
import { dayLabel } from "@/lib/format";
import type { Activity } from "@/types";

export const Route = createFileRoute("/_app/activity")({
  head: () => ({
    meta: [
      { title: "Activity — ZeitPlan" },
      { name: "description", content: "A clear history of everything ZeitPlan and its AI agent did." },
      { property: "og:title", content: "Activity — ZeitPlan" },
      { property: "og:description", content: "See what the AI agent did on your behalf." },
    ],
  }),
  component: ActivityPage,
});

function ActivityPage() {
  const { data, isLoading, isError, refetch } = useActivity();

  const groups = useMemo(() => {
    const map = new Map<string, Activity[]>();
    for (const item of data ?? []) {
      const key = dayLabel(item.createdAt);
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return [...map.entries()];
  }, [data]);

  return (
    <div className="space-y-6">
      <PageHeader title="Activity" subtitle="Everything ZeitPlan did on your behalf." />
      {isLoading ? (
        <ActivitySkeleton />
      ) : isError ? (
        <ErrorState title="Unable to load activity." onRetry={() => void refetch()} />
      ) : !groups.length ? (
        <EmptyState icon={History} title="No activity yet" description="Actions by you and the AI will appear here." />
      ) : (
        <div className="space-y-8">
          {groups.map(([label, items]) => (
            <section key={label} aria-labelledby={`group-${label}`}>
              <h2 id={`group-${label}`} className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
              </h2>
              <ol className="surface-panel relative p-5 before:absolute before:bottom-9 before:left-9 before:top-9 before:w-px before:bg-border">
                {items.map((item) => (
                  <ActivityItem key={item.id} activity={item} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
