/**
 * Runtime configuration. No localhost URLs anywhere else in the app.
 */
const rawBaseUrl = import.meta.env["VITE_API_BASE_URL"] as string | undefined;
const rawMode = import.meta.env["VITE_API_MODE"] as string | undefined;

export const config = {
  apiBaseUrl: rawBaseUrl?.replace(/\/$/, "") ?? "",
  /** "mock" until the ZeitPlan FastAPI backend is reachable. */
  apiMode: (rawMode ?? (rawBaseUrl ? "real" : "mock")) as "real" | "mock",
} as const;

export const isMockMode = config.apiMode === "mock";
