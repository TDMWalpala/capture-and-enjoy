import { Link } from "@tanstack/react-router";
import { CalendarClock, Clock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskPriorityBadge, TaskStatusBadge } from "./TaskStatusBadge";
import { formatDuration, scheduledLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const schedule = scheduledLabel(task.scheduledAt, task.scheduledEndAt);
  const completed = task.status === "completed";

  return (
    <article className="surface-panel group flex items-start gap-3 p-4 transition-colors hover:border-primary/30">
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggleComplete?.(task)}
        aria-label={completed ? `Mark ${task.title} as pending` : `Complete ${task.title}`}
        className="mt-0.5"
      />

      <div className="min-w-0 flex-1">
        <Link
          to="/tasks/$taskId"
          params={{ taskId: task.id }}
          className="rounded text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className={cn(completed && "text-muted-foreground line-through")}>{task.title}</span>
        </Link>

        {task.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1 font-normal">
            <Clock className="size-3" aria-hidden />
            {formatDuration(task.durationMinutes)}
          </Badge>
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
          {schedule ? (
            <Badge variant="info" className="gap-1 font-normal">
              <CalendarClock className="size-3" aria-hidden />
              {schedule}
            </Badge>
          ) : null}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Actions for ${task.title}`}
        >
          <MoreHorizontal className="size-4" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to="/tasks/$taskId" params={{ taskId: task.id }}>
              View details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onEdit?.(task)}>
            <Pencil className="size-4" aria-hidden />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => onDelete?.(task)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </article>
  );
}
