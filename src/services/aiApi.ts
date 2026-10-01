import { isMockMode } from "@/config/env";
import { delay, getState, nextId, pushActivity } from "@/lib/mock/store";
import type { AiCommandResponse } from "@/types";
import { api, endpoints } from "./api";

function findTask(text: string) {
  const lower = text.toLowerCase();
  return getState().tasks.find((task) => lower.includes(task.title.toLowerCase().split(" ")[0]!));
}

/**
 * Mock interpreter only. All real reasoning, scheduling and Google Calendar
 * writes belong to the ZeitPlan backend / AI agent.
 */
function mockInterpret(command: string): AiCommandResponse {
  const text = command.toLowerCase();
  const id = nextId("ai");
  const task = findTask(command);

  if (text.includes("delete") || text.includes("remove")) {
    return {
      id,
      reply: task
        ? `I can delete "${task.title}". This cannot be undone — should I continue?`
        : "I couldn't find a matching task to delete. Try naming the task.",
      proposal: task ? { kind: "delete", taskTitle: task.title, target: task.id } : { kind: "none" },
    };
  }

  if (text.includes("schedule") || text.includes("move") || text.includes("plan")) {
    const title = task?.title ?? command.replace(/schedule|move|plan|my|to|for/gi, "").trim();
    const dateLabel = text.includes("friday")
      ? "Friday"
      : text.includes("today")
        ? "Today"
        : "Tomorrow";
    return {
      id,
      reply: `I found free time ${dateLabel.toLowerCase()} from 14:00–16:00. Would you like me to schedule it?`,
      proposal: {
        kind: "schedule",
        taskTitle: title || "New task",
        dateLabel,
        timeRange: "14:00 – 16:00",
        target: task?.id,
      },
    };
  }

  if (text.includes("add") || text.includes("create")) {
    return {
      id,
      reply: `I'll add "${command.replace(/add|create/gi, "").trim()}" to your task list. Open the new task form to confirm the details, or ask me to schedule it.`,
      proposal: { kind: "none" },
    };
  }

  if (text.includes("today") || text.includes("pending") || text.includes("overdue")) {
    const pending = getState().tasks.filter((t) => t.status === "pending");
    return {
      id,
      reply: `You have ${pending.length} open tasks. The next one is "${pending[0]?.title ?? "nothing scheduled"}".`,
      proposal: { kind: "none" },
    };
  }

  return {
    id,
    reply: "I can create, schedule, move and summarise your tasks. Try one of the examples below.",
    proposal: { kind: "none" },
  };
}

export const aiApi = {
  async sendCommand(command: string): Promise<AiCommandResponse> {
    if (isMockMode) {
      const response = mockInterpret(command);
      pushActivity({
        type: "ai",
        message: `Interpreted “${command}”`,
        success: true,
      });
      return delay(response, 800);
    }
    return api.post<AiCommandResponse>(endpoints.aiCommand, { command });
  },

  /** Confirmation is always explicit — the UI never auto-confirms. */
  async confirm(response: AiCommandResponse): Promise<string> {
    if (isMockMode) {
      const proposal = response.proposal;
      const state = getState();
      if (proposal?.kind === "schedule") {
        const task = state.tasks.find((t) => t.id === proposal.target);
        if (task) {
          const start = new Date();
          start.setDate(start.getDate() + (proposal.dateLabel === "Today" ? 0 : 1));
          start.setHours(14, 0, 0, 0);
          const end = new Date(start.getTime() + task.durationMinutes * 60 * 1000);
          task.scheduledAt = start.toISOString();
          task.scheduledEndAt = end.toISOString();
          task.calendarUrl = "https://calendar.google.com/calendar/r";
        }
        pushActivity({
          type: "scheduled",
          message: `Scheduled "${proposal.taskTitle}" in Google Calendar`,
          taskTitle: proposal.taskTitle,
          success: true,
        });
        return delay(`Scheduled "${proposal.taskTitle}" ${proposal.dateLabel} ${proposal.timeRange}.`);
      }
      if (proposal?.kind === "delete") {
        state.tasks = state.tasks.filter((t) => t.id !== proposal.target);
        pushActivity({
          type: "deleted",
          message: `Deleted "${proposal.taskTitle}"`,
          taskTitle: proposal.taskTitle,
          success: true,
        });
        return delay(`Deleted "${proposal.taskTitle}".`);
      }
      return delay("Nothing to confirm.");
    }
    const result = await api.post<{ message: string }>(`${endpoints.aiCommand}/${response.id}/confirm`);
    return result.message;
  },
};
