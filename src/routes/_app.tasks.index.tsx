import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { TaskListSkeleton } from "@/components/common/Skeletons";
import { useTaskActions } from "@/components/tasks/TaskActions";
import { TaskList } from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasks } from "@/hooks/useTasks";

export const Route = createFileRoute("/_app/tasks/")({
  head: () => ({
    meta: [
      { title: "Tasks — ZeitPlan" },
      { name: "description", content: "Manage everything you need to get done." },
      { property: "og:title", content: "Tasks — ZeitPlan" },
      { property: "og:description", content: "Manage everything you need to get done." },
    ],
  }),
  component: TasksPage,
});

type Filter = "all" | "pending" | "completed" | "scheduled";

function TasksPage() {
  const { data, isLoading, isError, refetch } = useTasks();
  const { handlers, dialogs } = useTaskActions();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((task) => {
      if (filter === "pending" && task.status !== "pending") return false;
      if (filter === "completed" && task.status !== "completed") return false;
      if (filter === "scheduled" && !task.scheduledAt) return false;
      if (!term) return true;
      return `${task.title} ${task.description ?? ""}`.toLowerCase().includes(term);
    });
  }, [data, filter, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        subtitle="Manage everything you need to get done."
        action={
          <Button onClick={handlers.openCreate}>
            <Plus className="size-4" aria-hidden /> New Task
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            aria-label="Search tasks"
            placeholder="Search tasks"
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <TaskListSkeleton />
      ) : isError ? (
        <ErrorState title="Unable to load tasks." onRetry={() => void refetch()} />
      ) : !data?.length ? (
        <EmptyState
          icon={ListChecks}
          title="No tasks yet."
          description="Create your first task and let ZeitPlan help you organize it."
          action={
            <Button size="sm" onClick={handlers.openCreate}>
              <Plus className="size-4" aria-hidden /> Create task
            </Button>
          }
        />
      ) : filtered.length ? (
        <TaskList tasks={filtered} {...handlers} />
      ) : (
        <EmptyState icon={Search} title="No matching tasks" description="Try a different filter or search term." />
      )}

      {dialogs}
    </div>
  );
}
