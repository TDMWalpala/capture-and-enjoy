import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@/services/taskApi";
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types";

export const taskKeys = {
  all: ["tasks"] as const,
  detail: (id: string) => ["tasks", id] as const,
};

export function useTasks() {
  return useQuery({ queryKey: taskKeys.all, queryFn: taskApi.list });
}

export function useTask(id: string) {
  return useQuery({ queryKey: taskKeys.detail(id), queryFn: () => taskApi.get(id) });
}

function useInvalidateTasks() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    void queryClient.invalidateQueries({ queryKey: ["activity"] });
  };
}

export function useCreateTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => taskApi.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) => taskApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useCompleteTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (task: Task) =>
      taskApi.update(task.id, { status: task.status === "completed" ? "pending" : "completed" }),
    onSuccess: invalidate,
  });
}

export function useDeleteTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (id: string) => taskApi.remove(id),
    onSuccess: invalidate,
  });
}
