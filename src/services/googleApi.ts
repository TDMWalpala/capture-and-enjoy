import { isMockMode } from "@/config/env";
import { delay, getState } from "@/lib/mock/store";
import type { GoogleConnection } from "@/types";
import { api, endpoints } from "./api";

export const googleApi = {
  async status(): Promise<GoogleConnection> {
    if (isMockMode) return delay({ ...getState().google });
    return api.get<GoogleConnection>(endpoints.googleStatus);
  },

  /** The backend returns/owns the OAuth consent URL. */
  async connect(): Promise<void> {
    if (isMockMode) {
      await delay(null, 600);
      getState().google = {
        connected: true,
        email: getState().user?.email ?? null,
        calendarName: "Alex Winter — Personal",
      };
      return;
    }
    window.location.href = endpoints.googleConnect;
  },

  async disconnect(): Promise<void> {
    if (isMockMode) {
      await delay(null, 300);
      getState().google = { connected: false, email: null, calendarName: null };
      return;
    }
    await api.post(endpoints.googleDisconnect);
  },
};
