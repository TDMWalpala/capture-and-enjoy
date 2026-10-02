import { AlertTriangle, CalendarCheck, CheckCircle2, Plus, Sparkles, Trash2 } from "lucide-react";
import { timeLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Activity, ActivityType } from "@/types";

const icons: Record<ActivityType, typeof Plus> = {
  created: Plus,
  scheduled: CalendarCheck,
  completed: CheckCircle2,
  deleted: Trash2,
  ai: Sparkles,
  error: AlertTriangle,
};

export function ActivityItem({ activity }: { activity: Activity }) {
  const Icon = activity.success ? icons[activity.type] : AlertTriangle;
  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      <span
        className={cn(
          "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border",
          activity.success
            ? "border-border bg-card text-muted-foreground"
            : "border-destructive/30 bg-destructive/10 text-destructive",
        )}
      >
        <Icon className="size-3.5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 pt-1">
        <p className="text-sm text-foreground">
          {activity.message}
          <span className="sr-only">{activity.success ? " (succeeded)" : " (failed)"}</span>
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {timeLabel(activity.createdAt)}
          {activity.taskTitle ? ` · ${activity.taskTitle}` : ""}
          {!activity.success ? " · Failed" : ""}
        </p>
      </div>
    </li>
  );
}
