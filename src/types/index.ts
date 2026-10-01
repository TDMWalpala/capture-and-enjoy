export type TaskStatus = "pending" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null;
  scheduledAt?: string | null;
  scheduledEndAt?: string | null;
  calendarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  durationMinutes: number;
  priority: TaskPriority;
  dueDate?: string | null;
  schedulingRequest?: string;
}

export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>;

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface GoogleConnection {
  connected: boolean;
  email?: string | null;
  calendarName?: string | null;
}

export type ActivityType = "created" | "scheduled" | "completed" | "deleted" | "ai" | "error";

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  taskTitle?: string | null;
  success: boolean;
  createdAt: string;
}

export interface AiProposal {
  kind: "schedule" | "delete" | "none";
  taskTitle?: string;
  dateLabel?: string;
  timeRange?: string;
  target?: string;
}

export interface AiCommandResponse {
  id: string;
  reply: string;
  proposal?: AiProposal;
}

export interface Preferences {
  defaultDurationMinutes: number;
  defaultPriority: TaskPriority;
  timezone: string;
  confirmBeforeCalendarChanges: boolean;
}
