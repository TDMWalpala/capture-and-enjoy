import { CalendarClock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AiProposal } from "@/types";

interface ConfirmationCardProps {
  proposal: AiProposal;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationCard({ proposal, pending, onConfirm, onCancel }: ConfirmationCardProps) {
  const destructive = proposal.kind === "delete";
  const Icon = destructive ? Trash2 : CalendarClock;

  return (
    <div
      role="group"
      aria-label={destructive ? "Confirm deletion" : "Confirm schedule"}
      className={
        destructive
          ? "rounded-lg border border-destructive/30 bg-destructive/5 p-4"
          : "rounded-lg border border-primary/25 bg-accent/60 p-4"
      }
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {destructive ? "AI wants to delete" : "AI wants to schedule"}
      </p>
      <div className="mt-2 flex items-start gap-3">
        <Icon className={destructive ? "mt-0.5 size-4 text-destructive" : "mt-0.5 size-4 text-primary"} aria-hidden />
        <div className="text-sm">
          <p className="font-medium text-foreground">{proposal.taskTitle}</p>
          {!destructive ? (
            <p className="text-muted-foreground">
              {proposal.dateLabel} · {proposal.timeRange} · Google Calendar
            </p>
          ) : (
            <p className="text-muted-foreground">This cannot be undone.</p>
          )}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant={destructive ? "destructive" : "default"} onClick={onConfirm} disabled={pending}>
          {pending ? "Working…" : destructive ? "Delete task" : "Confirm schedule"}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
