import { useState, useRef, useMemo } from "react";
// ActionPanel: UI for selecting and executing server commands
// Integrates dynamic command parameter forms, confirmation modals, result dialogs, and command subset filtering
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Play } from "lucide-react";
import { getAvailableCommands, getCommandsForSubset } from "@/utils/tsplusCommands";
import type { CommandDefinition, CommandMethod } from "@/types/command.types";
import SelectWithTooltip from "../common/SelectWithTooltip";
import { CommandSubsetSelector } from "./CommandSubsetSelector";

import CommandParamsForm from "./CommandParamsForm";

import ModalConfirmCommand from "../common/ModalConfirmCommand";
import ModalErrorCommand from "../common/ModalErrorCommand";
import ModalSuccessCommand from "../common/ModalSuccessCommand";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Server } from "@/types/server.types";
import { useAuth } from "@/context/AuthContext";
import { useAllCommandSubsets } from "@/hooks/useCommandSubsets";
// removed unused imports
interface Props {
  server: Server;
  onClose: () => void;
}

/**
 * ActionPanel component
 * Allows users to select a command, fill in dynamic parameters, and execute it on a server.
 * Integrates CommandParamsForm for dynamic parameter input, confirmation and result modals, and error handling.
 *
 * Props:
 *   - server: Server object to operate on
 *   - onClose: callback to close the panel
 */
const ActionPanel = ({ server, onClose }: Props) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: allSubsets = [] } = useAllCommandSubsets(user?.id as string | undefined);
  
  // State for execution status, selected command, parameter values, and modal visibility
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState("");
  const [selectedSubsetId, setSelectedSubsetId] = useState<string | null>(null);

  // success message states removed — modal shows generic success text
  const [errorMessage, setErrorMessage] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [openModalResponse, setOpenModalResponse] = useState(false);

  // Accept string or boolean for dynamic form values
  const [paramsValues, setParamsValues] = useState<
    Record<string, string | boolean>
  >({});
  const selectTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Get translated commands dynamically (with i18n)
  const availableCommands = getAvailableCommands(t);
  
  // Filter commands based on selected subset
  const filteredCommands = useMemo(() => {
    if (!selectedSubsetId) return availableCommands;
    
    // Try to get command IDs from subset data first (for custom subsets)
    const subset = allSubsets.find((s) => s.id === selectedSubsetId);
    const subsetCommandIds = subset?.commandIds || getCommandsForSubset(selectedSubsetId);
    
    return availableCommands.filter((cmd) => subsetCommandIds.includes(cmd.id));
  }, [selectedSubsetId, availableCommands, allSubsets]);

  // Find the definition for the currently selected command (for dynamic form)
  const commandDefinition = filteredCommands.find(
    (command) => command.id === selectedCommand
  );

  // Default schema for commands without parameters (empty object)
  const defaultSchema = z.object({});

  // Use the schema for the selected command, or fallback to default
  const currentSchema = commandDefinition?.schema || defaultSchema;

  // Infer form data type from schema (for type safety)
  type FormData = z.infer<typeof currentSchema>;

  // React Hook Form setup for command parameters (dynamic validation)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(currentSchema as z.ZodType<any, any, any>),
    mode: "onChange",
  });
  // remove unused isDirty by not destructuring it from formState

  // Handle command selection change
  // Resets parameter values and form state
  const handleCommandChange = (value: string) => {
    setSelectedCommand(value);
    setParamsValues({});
    reset();
  };

  // Handle parameter value change (for dynamic form fields, including boolean)
  const handleParamChange = (
    paramId: string,
    value: string | number | boolean
  ) => {
    setParamsValues((prev) => ({
      ...prev,
      [paramId]: typeof value === 'number' ? String(value) : value,
    }));
  };

  // Check if a path parameter exists and validate its format (Windows/UNC/relative)
  const checkPathParam = (
    values: Record<string, string | boolean>
  ) => {
    const path = Object.entries(values).find(([key]) =>
      key.toLowerCase().includes("path")
    )?.[1];
    
    if (typeof path === "string" && path) {
      // Matches drive letter (C:\), UNC paths (\\server\share), or relative paths with backslashes
      return /^(?:[a-zA-Z]:\\|\\\\[^\\]+\\[^\\]+|(?:\.{1,2}\\)?[^/:*?<>|]+\\)+[^/:*?<>|]*$/.test(
        path
      );
    } else {
      return true; // No path parameter found
    }
  };

  /**
   * Execute the selected command with parameters
   * Handles path validation, calls the command API, and manages modal state for results/errors
   */
  const executedCommand = async () => {
    if (!commandDefinition) return;

    setIsExecuting(true);

    try {
      const pathValid = checkPathParam(paramsValues);

      if (!pathValid) {
        setErrorMessage(t("action_panel_invalid_path"));
        setOpenModalError(true);
        setIsExecuting(false);
        return;
      }

      // Gather parameter arguments in order
      const paramArgs = commandDefinition.params.map(
        (param) => paramsValues[param.id]
      );

      // Call the command's method
      const response = await (commandDefinition.api as CommandMethod)(
        ...paramArgs
      );

      const jsonResponse = JSON.parse(response);
      console.log(jsonResponse);

      if (jsonResponse.success) {
        setOpenModalResponse(true);
        // reset the form and internal param values after a successful execution
        reset();
        setParamsValues({});
      } else {
        setErrorMessage(jsonResponse.error || t("action_panel_unknown_error"));
        setOpenModalError(true);
      }
    } catch (error) {
      // Log any errors during execution
      console.log(error);
    } finally {
      setIsExecuting(false);
    }
  };

  // When the success modal is acknowledged: close modal, clear selected command, and focus the command select
  const handleSuccessAcknowledge = () => {
    setOpenModalResponse(false);
    setSelectedCommand("");
    // focus the select trigger for convenience
    if (selectTriggerRef.current && typeof selectTriggerRef.current.focus === "function") {
      selectTriggerRef.current.focus();
    }
  };

  // Determine if all required params are filled
  const allRequiredFilled = commandDefinition?.params
    ? commandDefinition.params
        .filter((param) => !param.optional)
        .every((param) => {
          const value = paramsValues[param.id];
          // Accept 0, false, and non-empty string/number/boolean
          return value !== undefined && value !== null && value !== "";
        })
    : true;

  // Disable the execute button if not ready (valid, not executing, command selected, and all required fields filled)
  const isDisabled =
    isExecuting ||
    !commandDefinition ||
    (commandDefinition?.params.length > 0 && (!isValid || !allRequiredFilled));

  return (
    <>
      {/* Modal to confirm command execution (appears before running command) */}
      <ModalConfirmCommand
        open={openModal}
        onConfirm={() => {
          setOpenModal(false);
          executedCommand();
        }}
        onCancel={() => {
          setOpenModal(false);
        }}
      />
      {/* Modal to show command execution result (success) */}
      <ModalSuccessCommand
        open={openModalResponse}
        onConfirm={handleSuccessAcknowledge}
      />
      {/* Modal to show command execution error */}
      <ModalErrorCommand
        open={openModalError}
        onConfirm={() => {
          setOpenModalError(false);
        }}
        error={errorMessage}
      />
      {/* Main card UI for command selection and execution */}
      <Card className="mt-6">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">
                {/* Panel title with server name */}
                {t("action_panel_title", { server: server.nombre })}
              </CardTitle>
              <CardDescription>
                {/* Panel description */}
                {t("action_panel_description")}
              </CardDescription>
            </div>
            {/* Close button for the panel */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label={t("action_panel_close")}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Command Subset Selector */}
          <CommandSubsetSelector
            userId={user?.id}
            selectedSubsetId={selectedSubsetId}
            onSubsetChange={setSelectedSubsetId}
            disabled={isExecuting}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              {/* Command selection dropdown with tooltips (filtered by subset) */}
              <SelectWithTooltip
                id="command-select"
                label={t("action_panel_select_command")}
                options={filteredCommands.map((command) => ({
                  id: command.id,
                  label: command.name,
                  description: command.description,
                }))}
                value={selectedCommand}
                        onChange={handleCommandChange}
                        triggerRef={selectTriggerRef}
                contentClassName="max-h-[450px]"
              />
            </div>

            {/* Dynamic form for command parameters (renders fields based on command definition) */}
            <CommandParamsForm
              commandDefinition={commandDefinition as CommandDefinition}
              paramsValues={paramsValues as Record<string, string | boolean | undefined>}
              handleParamChange={handleParamChange}
              register={register}
              control={control}
              errors={errors}
            />
          </div>

          {/* Form to submit the command for execution */}
          <form
            onSubmit={handleSubmit(() => {
              setOpenModal(true);
            })}
            className="flex pt-4 space-x-3"
          >
            {/* Execute button, disabled if not ready */}
            <Button
              disabled={isDisabled}
              className="disabled:opacity-50"
              variant="gradient"
            >
              <Play className="mr-2 w-4 h-4" />
              {isExecuting
                ? t("action_panel_executing")
                : t("action_panel_execute")}
            </Button>

            {/* Placeholder for future logs button (not implemented) */}
            {/* <Button variant="outline">
            <Eye className="mr-2 w-4 h-4" />
            {t('action_panel_view_logs')}
          </Button> */}
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default ActionPanel;
