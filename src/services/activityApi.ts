import { isMockMode } from "@/config/env";
import { delay, getState } from "@/lib/mock/store";
import type { Activity } from "@/types";
import { api, endpoints } from "./api";

export const activityApi = {
  async list(): Promise<Activity[]> {
    if (isMockMode) return delay([...getState().activity]);
    return api.get<Activity[]>(endpoints.activity);
  },
};
