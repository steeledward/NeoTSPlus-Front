import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ActionPanel from "../components/dashboard/ActionPanel";
import ServerGroupCards from "../components/dashboard/ServerGroupCards";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import CreateServerGroupModal from "@/components/dashboard/ModalCreateGroup";
import useServerGroup from "@/hooks/userServerGroup";
import { useServerContext } from "@/context/ServerContext";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useTranslation } from "react-i18next";

const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { serverGroups, isLoading } = useServerGroup();
  const { selectedServer, onServerSelect } = useServerContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Activar la animación cuando el componente se monta
    setIsVisible(true);
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-4xl font-extrabold text-gray-900">
            {t('control_panel')}
          </h1>
          <div className="flex justify-end mb-2">
            <LanguageSelector />
          </div>
          <motion.div
            className="flex justify-between items-end mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="mb-2 text-3xl font-bold text-transparent bg-clip-text card-gradient">
                {t('dashboard_welcome', { name: user?.name })}
              </h1>
              <p className="text-gray-600">
                {t('dashboard_description')}
              </p>
            </div>
            <CreateServerGroupModal />
          </motion.div>
          {/* // * I can use this stat cards later to show more things later in the project */}

          {/* 
          {isVisible && <StatsCards />} */}

          <AnimatePresence>
            {isVisible && (
              <ServerGroupCards groups={serverGroups} isLoading={isLoading} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedServer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                <ActionPanel
                  server={selectedServer}
                  onClose={() => onServerSelect(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
