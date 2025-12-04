/**
 * Activity Log Page
 * Displays activity logs in a timeline view
 */

import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LanguageSelector from "@/components/common/LanguageSelector";
import ActivityLogService from "@/services/activityLog";
import { AlertCircle, Check, Clock, ChevronRight } from "lucide-react";

const ActivityLogPage = () => {
  const { t } = useTranslation();
  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ["activityLogs"],
    queryFn: () => ActivityLogService.getActivityLogs(),
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "success":
        return <Check className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBgColor = (status?: string) => {
    switch (status) {
      case "success":
        return "bg-green-100";
      case "error":
        return "bg-red-100";
      default:
        return "bg-blue-100";
    }
  };

  const getActionColor = (action?: string) => {
    if (!action) return "text-gray-600";
    const actionLower = action.toLowerCase();
    if (
      actionLower.includes("delete") ||
      actionLower.includes("remove") ||
      actionLower.includes("logout")
    ) {
      return "text-red-600";
    }
    if (
      actionLower.includes("create") ||
      actionLower.includes("add") ||
      actionLower.includes("login")
    ) {
      return "text-green-600";
    }
    if (
      actionLower.includes("update") ||
      actionLower.includes("edit") ||
      actionLower.includes("modify")
    ) {
      return "text-blue-600";
    }
    return "text-gray-600";
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  const formatDateShort = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return `Today ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      } else {
        return date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      }
    } catch {
      return dateString;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-end mb-6">
            <LanguageSelector />
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("activity_logs")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("activity_logs_description")}
            </p>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50 mb-6">
              <CardContent className="p-4">
                <p className="text-red-800">
                  {t("error_loading_activity_logs")}
                </p>
              </CardContent>
            </Card>
          )}

          {logs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">{t("no_activity_logs")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-blue-100" />

              {/* Timeline items */}
              <div className="space-y-6">
                {logs.map((log) => (
                  <div key={log._id} className="relative pl-24">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-2 w-16 flex items-center justify-center">
                      <div className={`p-2 rounded-full ${getStatusBgColor(log.status)}`}>
                        {getStatusIcon(log.status)}
                      </div>
                    </div>

                    {/* Timeline card */}
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header with action and time */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className={`font-semibold text-lg ${getActionColor(log.action)}`}>
                                {log.action.replace(/_/g, " ")}
                              </h3>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                <span className="font-medium capitalize">{log.resource_type}</span>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-gray-500">
                                  {log.metadata?.email || log.metadata?.nome || log.metadata?.nombre || log.user_id}
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-medium text-gray-900">
                                {formatDateShort(log.timestamp)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(log.timestamp)}
                              </p>
                            </div>
                          </div>

                          {/* Description section */}
                          {log.description && (
                            <div className="pt-3 border-t border-gray-100">
                              <p className="text-sm text-gray-600 break-words">
                                {log.description}
                              </p>
                            </div>
                          )}

                          {/* Resource ID and metadata */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                            <span>ID: {log.resource_id}</span>
                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                              <span>
                                Details: {Object.entries(log.metadata)
                                  .map(([key, val]) => `${key}: ${val}`)
                                  .join(", ")}
                              </span>
                            )}
                          </div>

                          {/* Status badge */}
                          {log.status && (
                            <div className="flex items-center gap-2 pt-1">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  log.status === "success"
                                    ? "bg-green-100 text-green-700"
                                    : log.status === "error"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Timeline end marker */}
              {logs.length > 0 && (
                <div className="relative pl-24 pt-6">
                  <div className="absolute left-8 -top-2 w-0.5 h-6 bg-gradient-to-b from-blue-100 to-transparent" />
                  <div className="text-center text-sm text-gray-500">
                    End of timeline
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ActivityLogPage;
