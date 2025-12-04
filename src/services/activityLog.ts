import api from "@/utils/api";

export interface ActivityLogMetadata {
  email?: string;
  nome?: string;
  nombre?: string;
  [key: string]: string | undefined;
}

export interface ActivityLog {
  _id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  description: string;
  status: "success" | "error" | "pending";
  timestamp: string;
  metadata?: ActivityLogMetadata;
}

export interface ActivityLogsResponse {
  logs: ActivityLog[];
  message: string;
  success: boolean;
}

class ActivityLogService {
  static async getActivityLogs(): Promise<ActivityLog[]> {
    try {
      const response = await api.get<ActivityLogsResponse>("/activity_logs/");
      console.log(response.data);
      return response.data.logs || [];
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Error fetching activity logs: ${message}`);
    }
  }
}

export default ActivityLogService;
