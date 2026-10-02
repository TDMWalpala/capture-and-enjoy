import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CreateTaskInput, Task } from "@/types";

const schema = z.object({
  title: z.string().trim().min(1, "Give your task a title").max(120),
  description: z.string().max(1000).optional(),
  durationMinutes: z.coerce.number().int().min(5, "At least 5 minutes").max(1440),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
  schedulingRequest: z.string().max(200).optional(),
});

type FormValues = z.infer<typeof schema>;

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  submitting?: boolean;
  onSubmit: (input: CreateTaskInput) => void;
}

function toFormValues(task?: Task | null): FormValues {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    durationMinutes: task?.durationMinutes ?? 60,
    priority: task?.priority ?? "medium",
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
    schedulingRequest: "",
  };
}

export function TaskFormDialog({ open, onOpenChange, task, submitting, onSubmit }: TaskFormDialogProps) {
  const editing = Boolean(task);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: toFormValues(task),
  });

  useEffect(() => {
    if (open) form.reset(toFormValues(task));
  }, [open, task, form]);

  const submit = form.handleSubmit((values) =>
    onSubmit({
      title: values.title,
      description: values.description || undefined,
      durationMinutes: values.durationMinutes,
      priority: values.priority,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
      schedulingRequest: values.schedulingRequest || undefined,
    }),
  );

  const errors = form.formState.errors;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the details of this task."
              : "Nothing is added to Google Calendar unless you ask for scheduling."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Study FastAPI" aria-invalid={!!errors.title} {...form.register("title")} />
            {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Learn dependency injection and SQLAlchemy"
              {...form.register("description")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input id="duration" type="number" min={5} step={5} {...form.register("durationMinutes")} />
              {errors.durationMinutes ? (
                <p className="text-xs text-destructive">{errors.durationMinutes.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="priority">Priority</Label>
              <Controller
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="due">Due date</Label>
              <Input id="due" type="date" {...form.register("dueDate")} />
            </div>
          </div>

          {!editing ? (
            <div className="space-y-1.5">
              <Label htmlFor="scheduling">Scheduling request (optional)</Label>
              <Input
                id="scheduling"
                placeholder="e.g. tomorrow afternoon"
                {...form.register("schedulingRequest")}
              />
            </div>
          ) : null}

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : editing ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
