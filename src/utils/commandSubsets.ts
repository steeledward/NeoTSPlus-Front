/**
 * Predefined Command Subsets
 * Logical groupings of commands by functionality
 */

import type { CommandSubset } from "@/types/commandSubset.types";
import type { TFunction } from "i18next";

export function getPredefinedSubsets(t: TFunction): CommandSubset[] {
  return [
    {
      id: "maintenance",
      name: t("subset_maintenance"),
      description: t("subset_maintenance_desc"),
      commandIds: [
        "backup_data",
        "restore_data",
        "system_audit",
        "windows_compatibility",
        "update",
      ],
      createdBy: "system",
    },
    {
      id: "web_management",
      name: t("subset_web_management"),
      description: t("subset_web_management_desc"),
      commandIds: [
        "web_server",
        "web_credentials",
        "web_credentials_add",
        "web_credentials_remove",
      ],
      createdBy: "system",
    },
    {
      id: "licensing",
      name: t("subset_licensing"),
      description: t("subset_licensing_desc"),
      commandIds: [
        "activate_license",
        "license_reset",
        "vl_activate",
        "vl_enable",
        "vl_disable",
        "vl_update",
        "vl_credits_license",
        "vl_credits_support",
      ],
      createdBy: "system",
    },
    {
      id: "security",
      name: t("subset_security"),
      description: t("subset_security_desc"),
      commandIds: [
        "2fa_resetuser",
        "2fa_addusers",
        "2fa_addgroups",
        "2fa_getusers",
        "2fa_deleteuser",
        "windowscredential_addorupdate",
        "windowscredential_remove",
      ],
      createdBy: "system",
    },
    {
      id: "farm_management",
      name: t("subset_farm_management"),
      description: t("subset_farm_management_desc"),
      commandIds: [
        "farm_sessions_monitor",
        "farm_loadbalancing",
        "session_manager",
      ],
      createdBy: "system",
    },
    {
      id: "printer_management",
      name: t("subset_printer_management"),
      description: t("subset_printer_management_desc"),
      commandIds: ["install_printer", "remove_printer"],
      createdBy: "system",
    },
    {
      id: "proxy_management",
      name: t("subset_proxy_management"),
      description: t("subset_proxy_management_desc"),
      commandIds: ["proxy_set"],
      createdBy: "system",
    },
  ];
}

/**
 * Get commands for a specific subset
 */
export function getCommandsForSubset(
  subsetId: string,
  subsets: CommandSubset[]
): string[] {
  const subset = subsets.find((s) => s.id === subsetId);
  return subset?.commandIds || [];
}

/**
 * Get all subsets for a user (predefined + custom)
 */
export function getUserSubsets(
  userId: string,
  t: TFunction,
  customSubsets: CommandSubset[]
): CommandSubset[] {
  const predefined = getPredefinedSubsets(t);
  return [...predefined, ...customSubsets.filter((s) => s.createdBy === userId)];
}
