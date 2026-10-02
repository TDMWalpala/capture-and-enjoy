import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TaskFormDialog } from "./TaskFormDialog";
import { useCompleteTask, useCreateTask, useDeleteTask, useUpdateTask } from "@/hooks/useTasks";
import type { Task } from "@/types";

/** Shared create/edit/delete/complete wiring for any task list surface. */
export function useTaskActions() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  const create = useCreateTask();
  const update = useUpdateTask();
  const remove = useDeleteTask();
  const complete = useCompleteTask();

  const handlers = {
    openCreate: () => {
      setEditing(null);
      setFormOpen(true);
    },
    onEdit: (task: Task) => {
      setEditing(task);
      setFormOpen(true);
    },
    onDelete: (task: Task) => setDeleting(task),
    onToggleComplete: (task: Task) =>
      complete.mutate(task, {
        onSuccess: (updated) =>
          toast.success(updated.status === "completed" ? `Completed "${updated.title}"` : "Marked as pending"),
        onError: () => toast.error("Could not update the task."),
      }),
  };

  const dialogs = (
    <>
      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editing}
        submitting={create.isPending || update.isPending}
        onSubmit={(input) => {
          const { schedulingRequest: _ignored, ...rest } = input;
          const options = {
            onSuccess: () => {
              toast.success(editing ? "Task updated" : "Task created");
              setFormOpen(false);
            },
            onError: () => toast.error("Could not save the task. Try again."),
          };
          if (editing) update.mutate({ id: editing.id, input: rest }, options);
          else create.mutate(input, options);
        }}
      />
      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleting?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>This task will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!deleting) return;
                remove.mutate(deleting.id, {
                  onSuccess: () => toast.success("Task deleted"),
                  onError: () => toast.error("Could not delete the task."),
                });
                setDeleting(null);
              }}
            >
              Delete task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  return { handlers, dialogs, deleteTask: remove, editTask: handlers.onEdit };
}
