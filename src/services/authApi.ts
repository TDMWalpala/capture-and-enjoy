import { isMockMode } from "@/config/env";
import { delay, getState, setSignedIn } from "@/lib/mock/store";
import type { User } from "@/types";
import { api, endpoints } from "./api";

export const authApi = {
  async getCurrentUser(): Promise<User | null> {
    if (isMockMode) {
      const state = getState();
      return delay(state.signedIn ? state.user : null, 200);
    }
    try {
      return await api.get<User>(endpoints.me);
    } catch {
      return null;
    }
  },

  /**
   * Google OAuth is owned by the backend. In real mode we hand the browser
   * over to the backend-provided authorization URL.
   */
  async loginWithGoogle(): Promise<void> {
    if (isMockMode) {
      await delay(null, 500);
      setSignedIn(true);
      return;
    }
    window.location.href = `${endpoints.googleConnect}?intent=login`;
  },

  async logout(): Promise<void> {
    if (isMockMode) {
      await delay(null, 150);
      setSignedIn(false);
      return;
    }
    await api.post(endpoints.googleDisconnect);
  },
};
