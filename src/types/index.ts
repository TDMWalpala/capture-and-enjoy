export type TaskStatus = "pending" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string | undefined;
  durationMinutes: number;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null | undefined;
  scheduledAt?: string | null | undefined;
  scheduledEndAt?: string | null | undefined;
  calendarUrl?: string | null | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | undefined;
  durationMinutes: number;
  priority: TaskPriority;
  dueDate?: string | null | undefined;
  schedulingRequest?: string | undefined;
}

export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>;

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null | undefined;
}

export interface GoogleConnection {
  connected: boolean;
  email?: string | null | undefined;
  calendarName?: string | null | undefined;
}

export type ActivityType = "created" | "scheduled" | "completed" | "deleted" | "ai" | "error";

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  taskTitle?: string | null | undefined;
  success: boolean;
  createdAt: string;
}

export interface AiProposal {
  kind: "schedule" | "delete" | "none";
  taskTitle?: string | undefined;
  dateLabel?: string | undefined;
  timeRange?: string | undefined;
  target?: string | undefined;
}

export interface AiCommandResponse {
  id: string;
  reply: string;
  proposal?: AiProposal | undefined;
}

export interface Preferences {
  defaultDurationMinutes: number;
  defaultPriority: TaskPriority;
  timezone: string;
  confirmBeforeCalendarChanges: boolean;
}
