import { config } from "@/config/env";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new ApiError(await response.text().catch(() => response.statusText), response.status);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body === undefined ? null : JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body === undefined ? null : JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export const endpoints = {
  tasks: "/api/v1/tasks",
  task: (id: string) => `/api/v1/tasks/${id}`,
  me: "/api/v1/me",
  googleStatus: "/api/v1/google/status",
  googleConnect: "/api/v1/google/connect",
  googleDisconnect: "/api/v1/google/disconnect",
  aiCommand: "/api/v1/ai/command",
  activity: "/api/v1/activity",
} as const;
