
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

const MonitoringPage = () => {
  const { t } = useTranslation();
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            {t("monitoring_title")}
          </h1>
          <Card>
            <CardContent className="p-8 text-center">
              <Activity className="mx-auto mb-4 w-16 h-16 text-gray-400" />
              <p className="text-gray-600">{t("monitoring_description")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MonitoringPage;
