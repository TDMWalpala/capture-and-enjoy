import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, CalendarClock, Check, ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { ErrorState } from "@/components/common/ErrorState";
import { TaskListSkeleton } from "@/components/common/Skeletons";
import { useTaskActions } from "@/components/tasks/TaskActions";
import { TaskPriorityBadge, TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { Button } from "@/components/ui/button";
import { useCompleteTask, useDeleteTask, useTask } from "@/hooks/useTasks";
import { dayLabel, formatDuration, timeLabel } from "@/lib/format";

export const Route = createFileRoute("/_app/tasks/$taskId")({
  head: () => ({
    meta: [
      { title: "Task details — ZeitPlan" },
      { name: "description", content: "Details, status and scheduling for a ZeitPlan task." },
      { property: "og:title", content: "Task details — ZeitPlan" },
      { property: "og:description", content: "Details, status and scheduling for a task." },
    ],
  }),
  component: TaskDetailsPage,
});

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}

function TaskDetailsPage() {
  const { taskId } = Route.useParams();
  const navigate = useNavigate();
  const { data: task, isLoading, isError, refetch } = useTask(taskId);
  const complete = useCompleteTask();
  const remove = useDeleteTask();
  const { handlers, dialogs } = useTaskActions();

  if (isLoading) return <TaskListSkeleton rows={1} />;
  if (isError || !task) {
    return <ErrorState title="Unable to load this task." onRetry={() => void refetch()} />;
  }

  const fmt = (value?: string | null) => (value ? format(new Date(value), "d MMM yyyy") : "—");

  return (
    <div className="space-y-6">
      <Link to="/tasks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> Tasks
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{task.title}</h1>
        {task.description ? <p className="max-w-2xl text-sm text-muted-foreground">{task.description}</p> : null}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            size="sm"
            variant={task.status === "completed" ? "outline" : "default"}
            onClick={() =>
              complete.mutate(task, {
                onSuccess: (t) => {
                  toast.success(t.status === "completed" ? "Task completed" : "Marked as pending");
                  void refetch();
                },
              })
            }
          >
            <Check className="size-4" aria-hidden />
            {task.status === "completed" ? "Mark pending" : "Complete"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => handlers.onEdit(task)}>
            <Pencil className="size-4" aria-hidden /> Edit
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to="/dashboard">
              <CalendarClock className="size-4" aria-hidden /> Schedule
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              if (!window.confirm(`Delete "${task.title}"?`)) return;
              remove.mutate(task.id, {
                onSuccess: () => {
                  toast.success("Task deleted");
                  void navigate({ to: "/tasks" });
                },
              });
            }}
          >
            <Trash2 className="size-4" aria-hidden /> Delete
          </Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-panel p-5" aria-labelledby="details-heading">
          <h2 id="details-heading" className="mb-4 text-sm font-semibold">Details</h2>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Duration">{formatDuration(task.durationMinutes)}</Field>
            <Field label="Priority"><span className="capitalize">{task.priority}</span></Field>
            <Field label="Created">{fmt(task.createdAt)}</Field>
            <Field label="Due">{fmt(task.dueDate)}</Field>
          </dl>
        </section>

        <section className="surface-panel p-5" aria-labelledby="calendar-heading">
          <h2 id="calendar-heading" className="mb-4 text-sm font-semibold">Google Calendar</h2>
          {task.scheduledAt ? (
            <>
              <p className="flex items-center gap-1.5 text-sm font-medium text-success">
                <Check className="size-4" aria-hidden /> Scheduled in Google Calendar
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-4">
                <Field label="Date">{dayLabel(task.scheduledAt)}</Field>
                <Field label="Start">{timeLabel(task.scheduledAt)}</Field>
                <Field label="End">{task.scheduledEndAt ? timeLabel(task.scheduledEndAt) : "—"}</Field>
              </dl>
              {task.calendarUrl ? (
                <Button size="sm" variant="outline" className="mt-5" asChild>
                  <a href={task.calendarUrl} target="_blank" rel="noreferrer">
                    Open in Google Calendar <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                </Button>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Not scheduled yet. Ask ZeitPlan on the dashboard, e.g. “Schedule {task.title} tomorrow afternoon”.
            </p>
          )}
        </section>
      </div>

      {dialogs}
    </div>
  );
}
