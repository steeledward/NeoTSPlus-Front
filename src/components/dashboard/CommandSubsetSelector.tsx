/**
 * CommandSubsetSelector Component
 * UI for selecting and filtering commands by subset
 */

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAllCommandSubsets } from "@/hooks/useCommandSubsets";

interface CommandSubsetSelectorProps {
  userId: string | undefined;
  selectedSubsetId: string | null;
  onSubsetChange: (subsetId: string | null) => void;
  disabled?: boolean;
}

export function CommandSubsetSelector({
  userId,
  selectedSubsetId,
  onSubsetChange,
  disabled = false,
}: CommandSubsetSelectorProps) {
  const { t } = useTranslation();
  const { data: allSubsets = [] } = useAllCommandSubsets(userId);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", description: "" });

  const selectedSubset = allSubsets.find((s) => s.id === selectedSubsetId);

  const handleSubsetChange = (subsetId: string) => {
    onSubsetChange(subsetId === "all" ? null : subsetId);
  };

  const handleCreateClick = () => {
    setIsCreateOpen(true);
  };

  const handleCreateClose = () => {
    setIsCreateOpen(false);
    setCreateForm({ name: "", description: "" });
  };

  return (
    <>
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {t("command_subsets")}
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreateClick}
                disabled={disabled}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("subset_create")}</TooltipContent>
          </Tooltip>
        </div>

        <Select
          value={selectedSubsetId || "all"}
          onValueChange={handleSubsetChange}
          disabled={disabled}
        >
          <SelectTrigger ref={triggerRef} className="w-full">
            <SelectValue placeholder={t("subset_select")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("subset_all_commands")}</SelectItem>

            {/* Predefined subsets */}
            {allSubsets
              .filter((s) => !s.id.startsWith("custom_"))
              .map((subset) => (
                <SelectItem key={subset.id} value={subset.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{subset.name}</span>
                    </TooltipTrigger>
                    <TooltipContent>{subset.description}</TooltipContent>
                  </Tooltip>
                </SelectItem>
              ))}

            {/* Custom subsets */}
            {allSubsets.some((s) => s.id.startsWith("custom_")) && (
              <>
                <div className="relative flex cursor-default select-none items-center bg-muted px-2 py-1.5 text-xs font-medium outline-none">
                  {t("subset_custom")}
                </div>
                {allSubsets
                  .filter((s) => s.id.startsWith("custom_"))
                  .map((subset) => (
                    <SelectItem key={subset.id} value={subset.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{subset.name}</span>
                        </TooltipTrigger>
                        <TooltipContent>{subset.description}</TooltipContent>
                      </Tooltip>
                    </SelectItem>
                  ))}
              </>
            )}
          </SelectContent>
        </Select>

        {selectedSubset && (
          <p className="text-xs text-muted-foreground">
            {selectedSubset.description}
          </p>
        )}
      </div>

      {/* Create Custom Subset Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("subset_create")}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="subset-name">
                {t("full_name")}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="subset-name"
                placeholder={t("full_name_placeholder")}
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="subset-description">{t("command_subsets_description")}</Label>
              <Textarea
                id="subset-description"
                placeholder={t("command_subsets_description")}
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCreateClose}>
              {t("cancel")}
            </Button>
            <Button
              onClick={() => {
                // TODO: Implement create mutation
                handleCreateClose();
              }}
              disabled={!createForm.name.trim()}
            >
              {t("accept")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
