import { format, isThisYear, isToday, isTomorrow, isYesterday } from "date-fns";

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const hourLabel = `${hours} ${hours === 1 ? "hour" : "hours"}`;
  return rest ? `${hourLabel} ${rest} min` : hourLabel;
}

export function dayLabel(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";
  return format(date, isThisYear(date) ? "EEE d MMM" : "d MMM yyyy");
}

export function timeLabel(value: string | Date): string {
  return format(typeof value === "string" ? new Date(value) : value, "HH:mm");
}

export function scheduledLabel(start?: string | null, end?: string | null): string | null {
  if (!start) return null;
  const base = `${dayLabel(start)} at ${timeLabel(start)}`;
  return end ? `${dayLabel(start)}, ${timeLabel(start)} – ${timeLabel(end)}` : base;
}

export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
