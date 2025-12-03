/**
 * Command Groups Management Page
 * CRUD interface for managing command subsets/groups
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Edit2, Trash2, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LanguageSelector from "@/components/common/LanguageSelector";
import {
  useAllCommandSubsets,
  useCreateCommandSubset,
  useUpdateCommandSubset,
  useDeleteCommandSubset,
} from "@/hooks/useCommandSubsets";
import { getAvailableCommands } from "@/utils/tsplusCommands";
import type { CommandSubset } from "@/types/commandSubset.types";

const CommandGroupsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: allSubsets = [] } = useAllCommandSubsets(user?.id as string | undefined);
  const createMutation = useCreateCommandSubset(user?.id as string | undefined);
  const updateMutation = useUpdateCommandSubset(user?.id as string | undefined);
  const deleteMutation = useDeleteCommandSubset(user?.id as string | undefined);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<CommandSubset | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    description: "",
    commandIds: [] as string[]
  });

  const availableCommands = getAvailableCommands(t);

  // Separate predefined and custom subsets
  const predefinedSubsets = allSubsets.filter((s) => !s.id.startsWith("custom_"));
  const customSubsets = allSubsets.filter((s) => s.id.startsWith("custom_"));

  const handleOpenCreate = () => {
    setFormData({ name: "", description: "", commandIds: [] });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (subset: CommandSubset) => {
    setSelectedGroup(subset);
    setFormData({ 
      name: subset.name || "", 
      description: subset.description || "",
      commandIds: subset.commandIds || []
    });
    setIsEditOpen(true);
  };

  const handleToggleCommand = (commandId: string) => {
    setFormData((prev) => ({
      ...prev,
      commandIds: prev.commandIds.includes(commandId)
        ? prev.commandIds.filter((id) => id !== commandId)
        : [...prev.commandIds, commandId],
    }));
  };

  const handleCreateSubmit = async () => {
    if (!formData.name.trim()) return;

    await createMutation.mutateAsync({
      name: formData.name,
      description: formData.description,
      commandIds: formData.commandIds,
    });

    setIsCreateOpen(false);
    setFormData({ name: "", description: "", commandIds: [] });
  };

  const handleUpdateSubmit = async () => {
    if (!selectedGroup || !formData.name.trim()) return;

    await updateMutation.mutateAsync({
      subsetId: selectedGroup.id,
      updates: {
        name: formData.name,
        description: formData.description,
        commandIds: formData.commandIds,
      },
    });

    setIsEditOpen(false);
    setSelectedGroup(null);
    setFormData({ name: "", description: "", commandIds: [] });
  };

  const handleDelete = async (subsetId: string) => {
    if (confirm(t("confirm_delete"))) {
      await deleteMutation.mutateAsync(subsetId);
    }
  };

  const getCommandCount = (subset: CommandSubset) => {
    return subset.commandIds?.length || 0;
  };

  const SubsetCard = ({ subset, isPredefined }: { subset: CommandSubset; isPredefined: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">
                {subset.name}
              </h3>
              {isPredefined && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                  {t("system")}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">{subset.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{getCommandCount(subset)} {t("commands")}</span>
              {!isPredefined && subset.createdBy && (
                <span>{t("created_by")}: {subset.createdBy}</span>
              )}
            </div>
          </div>

          {!isPredefined && (
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleOpenEdit(subset)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title={t("edit")}
              >
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(subset.id)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title={t("delete")}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-end mb-4">
            <LanguageSelector />
          </div>

          <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("command_subsets")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("command_subsets_description")}
            </p>
          </div>
          <Button
            onClick={handleOpenCreate}
            className="gap-2"
            variant="gradient"
          >
            <Plus className="w-4 h-4" />
            {t("subset_create")}
          </Button>
        </div>

        {/* Predefined Subsets */}
        {predefinedSubsets.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ChevronRight className="w-5 h-5" />
              {t("system")} {t("command_subsets")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predefinedSubsets.map((subset) => (
                <SubsetCard
                  key={subset.id}
                  subset={subset}
                  isPredefined={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Custom Subsets */}
        {customSubsets.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ChevronRight className="w-5 h-5" />
              {t("subset_custom")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customSubsets.map((subset) => (
                <SubsetCard
                  key={subset.id}
                  subset={subset}
                  isPredefined={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {customSubsets.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">
                {t("no_custom_groups")}
              </p>
              <Button onClick={handleOpenCreate} variant="outline">
                {t("create_first_group")}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("subset_create")}</DialogTitle>
            <DialogDescription>
              {t("command_subsets_description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="create-name">
                {t("full_name")}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="create-name"
                placeholder={t("group_name_placeholder")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="create-description">
                {t("command_subsets_description")}
              </Label>
              <Textarea
                id="create-description"
                placeholder={t("group_description_placeholder")}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div>
              <Label className="mb-3 block">{t("commands")}</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {availableCommands.length === 0 ? (
                  <p className="text-sm text-gray-500">{t("no_commands_available")}</p>
                ) : (
                  availableCommands.map((cmd) => (
                    <div key={cmd.id} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id={`cmd-create-${cmd.id}`}
                        checked={formData.commandIds.includes(cmd.id)}
                        onChange={() => handleToggleCommand(cmd.id)}
                        className="mt-1 cursor-pointer"
                      />
                      <label 
                        htmlFor={`cmd-create-${cmd.id}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        <div className="font-medium text-gray-900">{cmd.name}</div>
                        <div className="text-xs text-gray-600">{cmd.description}</div>
                      </label>
                    </div>
                  ))
                )}
              </div>
              {formData.commandIds.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  {formData.commandIds.length} {t("commands")} {t("selected")}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleCreateSubmit}
              disabled={!formData.name.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? t("creating") : t("accept")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("edit")} {t("command_subsets")}</DialogTitle>
            <DialogDescription>
              {t("command_subsets_description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">
                {t("full_name")}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder={t("group_name_placeholder")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="edit-description">
                {t("command_subsets_description")}
              </Label>
              <Textarea
                id="edit-description"
                placeholder={t("group_description_placeholder")}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div>
              <Label className="mb-3 block">{t("commands")}</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {availableCommands.length === 0 ? (
                  <p className="text-sm text-gray-500">{t("no_commands_available")}</p>
                ) : (
                  availableCommands.map((cmd) => (
                    <div key={cmd.id} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id={`cmd-edit-${cmd.id}`}
                        checked={formData.commandIds.includes(cmd.id)}
                        onChange={() => handleToggleCommand(cmd.id)}
                        className="mt-1 cursor-pointer"
                      />
                      <label 
                        htmlFor={`cmd-edit-${cmd.id}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        <div className="font-medium text-gray-900">{cmd.name}</div>
                        <div className="text-xs text-gray-600">{cmd.description}</div>
                      </label>
                    </div>
                  ))
                )}
              </div>
              {formData.commandIds.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  {formData.commandIds.length} {t("commands")} {t("selected")}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleUpdateSubmit}
              disabled={!formData.name.trim() || updateMutation.isPending}
            >
              {updateMutation.isPending ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommandGroupsPage;
