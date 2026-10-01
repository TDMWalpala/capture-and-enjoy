import { isMockMode } from "@/config/env";
import { delay, getState, nextId, pushActivity } from "@/lib/mock/store";
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types";
import { api, endpoints } from "./api";

export const taskApi = {
  async list(): Promise<Task[]> {
    if (isMockMode) return delay([...getState().tasks]);
    return api.get<Task[]>(endpoints.tasks);
  },

  async get(id: string): Promise<Task> {
    if (isMockMode) {
      const task = getState().tasks.find((t) => t.id === id);
      if (!task) throw new Error("Task not found");
      return delay(task);
    }
    return api.get<Task>(endpoints.task(id));
  },

  async create(input: CreateTaskInput): Promise<Task> {
    if (isMockMode) {
      const now = new Date().toISOString();
      const task: Task = {
        id: nextId("tsk"),
        title: input.title,
        description: input.description,
        durationMinutes: input.durationMinutes,
        priority: input.priority,
        status: "pending",
        dueDate: input.dueDate ?? null,
        scheduledAt: null,
        scheduledEndAt: null,
        calendarUrl: null,
        createdAt: now,
        updatedAt: now,
      };
      getState().tasks.unshift(task);
      pushActivity({
        type: "created",
        message: `Created task "${task.title}"`,
        taskTitle: task.title,
        success: true,
      });
      return delay(task);
    }
    return api.post<Task>(endpoints.tasks, input);
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    if (isMockMode) {
      const state = getState();
      const index = state.tasks.findIndex((t) => t.id === id);
      if (index === -1) throw new Error("Task not found");
      const updated: Task = {
        ...state.tasks[index]!,
        ...input,
        updatedAt: new Date().toISOString(),
      };
      state.tasks[index] = updated;
      if (input.status === "completed") {
        pushActivity({
          type: "completed",
          message: `Completed "${updated.title}"`,
          taskTitle: updated.title,
          success: true,
        });
      }
      return delay(updated);
    }
    return api.patch<Task>(endpoints.task(id), input);
  },

  async remove(id: string): Promise<void> {
    if (isMockMode) {
      const state = getState();
      const task = state.tasks.find((t) => t.id === id);
      state.tasks = state.tasks.filter((t) => t.id !== id);
      if (task) {
        pushActivity({
          type: "deleted",
          message: `Deleted task "${task.title}"`,
          taskTitle: task.title,
          success: true,
        });
      }
      await delay(null);
      return;
    }
    await api.delete(endpoints.task(id));
  },
};
