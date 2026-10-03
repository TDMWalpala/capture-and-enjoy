import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ListChecks, Plus } from "lucide-react";
import { useMemo } from "react";
import { isToday } from "date-fns";
import { AICommandBox } from "@/components/ai/AICommandBox";
import { ActivityItem } from "@/components/activity/ActivityItem";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { ActivitySkeleton, DashboardSkeleton } from "@/components/common/Skeletons";
import { GoogleConnectionCard } from "@/components/google/GoogleConnectionCard";
import { useTaskActions } from "@/components/tasks/TaskActions";
import { TaskList } from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/hooks/useActivity";
import { useTasks } from "@/hooks/useTasks";
import { greeting } from "@/lib/format";
import type { Task } from "@/types";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ZeitPlan" },
      { name: "description", content: "Your day at a glance: today's tasks and your AI command center." },
      { property: "og:title", content: "Dashboard — ZeitPlan" },
      { property: "og:description", content: "Here's what needs your attention today." },
    ],
  }),
  component: DashboardPage,
});

function isTodayTask(task: Task) {
  const ref = task.scheduledAt ?? task.dueDate;
  return ref ? isToday(new Date(ref)) : false;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="surface-panel p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

function DashboardPage() {
  const tasksQuery = useTasks();
  const activityQuery = useActivity();
  const { handlers, dialogs } = useTaskActions();

  const today = useMemo(() => (tasksQuery.data ?? []).filter(isTodayTask), [tasksQuery.data]);
  const stats = useMemo(
    () => ({
      today: today.length,
      completed: today.filter((t) => t.status === "completed").length,
      pending: today.filter((t) => t.status === "pending").length,
      scheduled: today.filter((t) => t.scheduledAt).length,
    }),
    [today],
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{greeting()}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's what needs your attention today.</p>
      </header>

      <AICommandBox />

      {tasksQuery.isLoading ? (
        <DashboardSkeleton />
      ) : tasksQuery.isError ? (
        <ErrorState title="Unable to load tasks." onRetry={() => void tasksQuery.refetch()} />
      ) : (
        <>
          <section aria-labelledby="today-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 id="today-heading" className="text-sm font-semibold text-foreground">
                Today's Tasks
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/tasks">
                  All tasks <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </Button>
            </div>
            {today.length ? (
              <TaskList tasks={today} {...handlers} />
            ) : (
              <EmptyState
                icon={ListChecks}
                title="Nothing planned for today"
                description="Tell ZeitPlan what you want to get done, or create a task manually."
                action={
                  <Button size="sm" onClick={handlers.openCreate}>
                    <Plus className="size-4" aria-hidden /> Create task
                  </Button>
                }
              />
            )}
          </section>

          <section aria-label="Statistics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Tasks today" value={stats.today} />
            <StatCard label="Completed" value={stats.completed} />
            <StatCard label="Pending" value={stats.pending} />
            <StatCard label="Scheduled" value={stats.scheduled} />
          </section>
        </>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section aria-labelledby="recent-activity" className="surface-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="recent-activity" className="text-sm font-semibold text-foreground">
              Recent activity
            </h2>
            <Link to="/activity" className="text-xs text-muted-foreground hover:text-foreground">
              View all
            </Link>
          </div>
          {activityQuery.isLoading ? (
            <ActivitySkeleton />
          ) : activityQuery.isError ? (
            <ErrorState title="Unable to load activity." onRetry={() => void activityQuery.refetch()} />
          ) : (
            <ol>
              {(activityQuery.data ?? []).slice(0, 4).map((item) => (
                <ActivityItem key={item.id} activity={item} />
              ))}
            </ol>
          )}
        </section>
        <GoogleConnectionCard compact />
      </div>

      {dialogs}
    </div>
  );
}
