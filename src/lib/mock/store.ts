import type { Activity, GoogleConnection, Task, User } from "@/types";
import {
  createMockActivity,
  createMockGoogleConnection,
  createMockTasks,
  createMockUser,
} from "./data";

interface MockState {
  user: User | null;
  signedIn: boolean;
  tasks: Task[];
  activity: Activity[];
  google: GoogleConnection;
}

let state: MockState | null = null;

const SESSION_KEY = "zeitplan.session";

/** Lazily seeded so no I/O or randomness runs at module scope. */
export function getState(): MockState {
  if (!state) {
    state = {
      user: createMockUser(),
      signedIn:
        typeof window !== "undefined" && window.localStorage.getItem(SESSION_KEY) === "active",
      tasks: createMockTasks(),
      activity: createMockActivity(),
      google: createMockGoogleConnection(),
    };
  }
  return state;
}

export function setSignedIn(value: boolean) {
  getState().signedIn = value;
  if (typeof window === "undefined") return;
  if (value) window.localStorage.setItem(SESSION_KEY, "active");
  else window.localStorage.removeItem(SESSION_KEY);
}

export function nextId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function pushActivity(entry: Omit<Activity, "id" | "createdAt">) {
  getState().activity.unshift({
    ...entry,
    id: nextId("act"),
    createdAt: new Date().toISOString(),
  });
}

export function delay<T>(value: T, ms = 320): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
