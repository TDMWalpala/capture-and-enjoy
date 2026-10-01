import { Check, CircleDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TaskPriority, TaskStatus } from "@/types";

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return status === "completed" ? (
    <Badge variant="success" className="gap-1">
      <Check className="size-3" aria-hidden />
      Completed
    </Badge>
  ) : (
    <Badge variant="muted" className="gap-1">
      <CircleDot className="size-3" aria-hidden />
      Pending
    </Badge>
  );
}

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low priority",
  medium: "Medium priority",
  high: "High priority",
};

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const variant = priority === "high" ? "warning" : priority === "medium" ? "info" : "muted";
  return <Badge variant={variant}>{priorityLabels[priority]}</Badge>;
}
