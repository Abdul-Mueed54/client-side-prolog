import { create } from "zustand";
import { AuditLog } from "@/types";
import { useAuthStore } from "./useAuthStore";

interface AuditLogStore {
  logs: AuditLog[];
  totalPages: number;
  currentPage: number;
  totalLogs: number;
  isLoading: boolean;
  error: null | string;
  fetchLogs: (params?: { page?: number; limit?: number }) => Promise<void>;
}

export const useAuditLogStore = create<AuditLogStore>((set) => ({
  logs: [],
  totalPages: 1,
  currentPage: 1,
  totalLogs: 0,
  isLoading: false,
  error: null,

  fetchLogs: async (params = {}) => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/audit/getAudits`);

      const page = params.page || 1;
      const limit = params.limit || 10;
      const offset = (page - 1) * limit;

      url.searchParams.append("limit", limit.toString());
      url.searchParams.append("offset", offset.toString());

      const response = await fetch(url.toString(), { method: "GET", headers });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to fetch audit logs");
      }

      const rawLogs = json.data?.data || [];
      const meta = json.data?.meta || {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
      };

      const formattedLogs: AuditLog[] = rawLogs.map((raw: any) => ({
        id: raw.log_id,
        tableName: raw.table_name,
        action: raw.action,
        oldData: raw.old_data,
        newData: raw.new_data,
        changedAt: raw.changed_at,
      }));

      set({
        logs: formattedLogs,
        totalPages: meta.totalPages,
        currentPage: meta.currentPage,
        totalLogs: meta.totalRecords,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "An unexpected error occurred.",
        logs: [],
      });
    }
  },
}));
