import type { Activity, GoogleConnection, Task, User } from "@/types";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function iso(date: Date) {
  return date.toISOString();
}

function at(dayOffset: number, hours: number, minutes = 0) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export function createMockUser(): User {
  return {
    id: "usr_1",
    name: "Alex Winter",
    email: "alex.winter@gmail.com",
    avatarUrl: null,
  };
}

export function createMockGoogleConnection(): GoogleConnection {
  return {
    connected: true,
    email: "alex.winter@gmail.com",
    calendarName: "Alex Winter — Personal",
  };
}

export function createMockTasks(): Task[] {
  const now = new Date();
  const base = {
    createdAt: iso(new Date(now.getTime() - 2 * DAY)),
    updatedAt: iso(now),
  };

  return [
    {
      ...base,
      id: "tsk_1",
      title: "Study FastAPI",
      description: "Learn dependency injection and SQLAlchemy sessions.",
      durationMinutes: 120,
      priority: "high",
      status: "pending",
      dueDate: iso(at(0, 23, 59)),
      scheduledAt: iso(at(0, 10)),
      scheduledEndAt: iso(at(0, 12)),
      calendarUrl: "https://calendar.google.com/calendar/r",
    },
    {
      ...base,
      id: "tsk_2",
      title: "Finish project documentation",
      description: "Write the architecture overview and the setup guide.",
      durationMinutes: 90,
      priority: "medium",
      status: "pending",
      dueDate: iso(at(0, 18)),
      scheduledAt: iso(at(0, 14)),
      scheduledEndAt: iso(at(0, 15, 30)),
      calendarUrl: "https://calendar.google.com/calendar/r",
    },
    {
      ...base,
      id: "tsk_3",
      title: "Grocery shopping",
      description: "Pick up groceries for the week.",
      durationMinutes: 30,
      priority: "low",
      status: "pending",
      dueDate: iso(at(0, 20)),
      scheduledAt: null,
      scheduledEndAt: null,
      calendarUrl: null,
    },
    {
      ...base,
      id: "tsk_4",
      title: "Gym",
      description: "Upper body session.",
      durationMinutes: 60,
      priority: "medium",
      status: "pending",
      dueDate: iso(at(0, 21)),
      scheduledAt: iso(at(0, 18, 30)),
      scheduledEndAt: iso(at(0, 19, 30)),
      calendarUrl: "https://calendar.google.com/calendar/r",
    },
    {
      ...base,
      id: "tsk_5",
      title: "Read Python documentation",
      description: "Async primitives and task groups.",
      durationMinutes: 45,
      priority: "low",
      status: "completed",
      dueDate: iso(at(-1, 17)),
      scheduledAt: iso(at(-1, 16)),
      scheduledEndAt: iso(at(-1, 16, 45)),
      calendarUrl: "https://calendar.google.com/calendar/r",
    },
    {
      ...base,
      id: "tsk_6",
      title: "Plan sprint review",
      description: "Collect demo items from the team.",
      durationMinutes: 45,
      priority: "high",
      status: "pending",
      dueDate: iso(at(1, 12)),
      scheduledAt: null,
      scheduledEndAt: null,
      calendarUrl: null,
    },
    {
      ...base,
      id: "tsk_7",
      title: "Dentist appointment",
      durationMinutes: 60,
      priority: "medium",
      status: "completed",
      dueDate: iso(at(-1, 9)),
      scheduledAt: iso(at(-1, 9)),
      scheduledEndAt: iso(at(-1, 10)),
      calendarUrl: "https://calendar.google.com/calendar/r",
    },
  ];
}

export function createMockActivity(): Activity[] {
  const now = new Date();
  return [
    {
      id: "act_1",
      type: "created",
      message: 'Created task "Study FastAPI"',
      taskTitle: "Study FastAPI",
      success: true,
      createdAt: iso(new Date(now.getTime() - 3 * HOUR)),
    },
    {
      id: "act_2",
      type: "ai",
      message: "Found free time 14:00–16:00",
      taskTitle: "Study FastAPI",
      success: true,
      createdAt: iso(new Date(now.getTime() - 3 * HOUR + 2 * MINUTE)),
    },
    {
      id: "act_3",
      type: "scheduled",
      message: 'Scheduled "Study FastAPI" in Google Calendar',
      taskTitle: "Study FastAPI",
      success: true,
      createdAt: iso(new Date(now.getTime() - 3 * HOUR + 3 * MINUTE)),
    },
    {
      id: "act_4",
      type: "error",
      message: "Could not reach Google Calendar while moving “Gym”",
      taskTitle: "Gym",
      success: false,
      createdAt: iso(new Date(now.getTime() - 6 * HOUR)),
    },
    {
      id: "act_5",
      type: "completed",
      message: 'Completed "Read Python documentation"',
      taskTitle: "Read Python documentation",
      success: true,
      createdAt: iso(new Date(now.getTime() - DAY - 2 * HOUR)),
    },
    {
      id: "act_6",
      type: "created",
      message: 'Created task "Dentist appointment"',
      taskTitle: "Dentist appointment",
      success: true,
      createdAt: iso(new Date(now.getTime() - DAY - 5 * HOUR)),
    },
  ];
}
