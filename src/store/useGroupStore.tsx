import { create } from "zustand";
import { Groups } from "@/types";
import { useAuthStore } from "./useAuthStore";

export interface NewGroupPayload {
  groupLeader: string;
  member2: string;
  member3: string;
  member4: string;
}

interface GroupStore {
  groups: Groups[];
  isLoading: boolean;
  error: null | string;
  fetchGroups: () => Promise<void>;
  addGroup: (data: NewGroupPayload) => Promise<void>;
}

export const useGroupStore = create<GroupStore>((set, get) => ({
  groups: [],
  isLoading: false,
  error: null,

  fetchGroups: async () => {
    set({ isLoading: true, error: null });

    try {
      const { token, role, user } = useAuthStore.getState();
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/group/getGroups`,
        { method: "GET", headers },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to fetch groups");
      }

      const formattedGroups: Groups[] = json.data.map((rawGroup: any) => ({
        groupId: rawGroup.group_id,
        groupLeader: rawGroup.group_leader,
        member2: rawGroup.member_2 || null,
        member3: rawGroup.member_3 || null,
        member4: rawGroup.member_4 || null,
        projectId: rawGroup.project_id || null,
      }));

      set({
        groups: formattedGroups,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.message ||
          "An unexpected error occurred while fetching groups.",
        groups: [],
      });
    }
  },

  addGroup: async (data: NewGroupPayload) => {
    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/group/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to create group");
      }

      const rawGroup = json.data;

      const newGroup: Groups = {
        groupId: rawGroup.groupId,
        groupLeader: rawGroup.groupLeader,
        member2: rawGroup.member2 || null,
        member3: rawGroup.member3 || null,
        member4: rawGroup.member4 || null,
        projectId: rawGroup.projectId || null,
      };

      set((state) => ({
        groups: [newGroup, ...state.groups],
      }));
    } catch (error: any) {
      console.error("Error adding group:", error);
      throw error;
    }
  },
}));
