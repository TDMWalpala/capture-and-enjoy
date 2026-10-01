import { useCallback, useEffect, useState } from "react";
import type { Preferences } from "@/types";

const STORAGE_KEY = "zeitplan.preferences";

export const defaultPreferences: Preferences = {
  defaultDurationMinutes: 60,
  defaultPriority: "medium",
  timezone: "Europe/Vienna",
  confirmBeforeCalendarChanges: true,
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setPreferences({ ...defaultPreferences, ...(JSON.parse(raw) as Partial<Preferences>) });
    } catch {
      /* ignore malformed preferences */
    }
  }, []);

  const update = useCallback((patch: Partial<Preferences>) => {
    setPreferences((current) => {
      const next = { ...current, ...patch };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { preferences, update };
}
