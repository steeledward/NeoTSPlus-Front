import { useState } from "react";
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
import AVAILABLE_COMMANDS from "@/utils/tsplusCommands";
import type { CommandDefinition, CommandMethod } from "@/types/command.types";
import SelectWithTooltip from "../common/SelectWithTooltip";

import CommandParamsForm from "./CommandParamsForm";
import ModalConfirmCommand from "../common/ModalConfirmCommand";
import ModalResponseCommand from "../common/ModalResponseCommand";
import ModalErrorCommand from "../common/ModalErrorCommand";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Server } from "@/types/server.types";
interface Props {
  server: Server;
  onClose: () => void;
}

// ActionPanel allows users to select and execute commands on a server
const ActionPanel = ({ server, onClose }: Props) => {
  // State for execution status, selected command, parameter values, and modal
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState("");

  const [messageResponseCommand, setMessageResponseCommand] = useState(
    "Comando ejecutado con éxito"
  );
  const [messageResponseResponse, setMessageResponseResponse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [openModalResponse, setOpenModalResponse] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);

  const [paramsValues, setParamsValues] = useState<
    Record<string, string | number>
  >({});

  // Find the definition for the currently selected command
  const commandDefinition = AVAILABLE_COMMANDS.find(
    (command) => command.id === selectedCommand
  );

  // Default schema for commands without parameters
  const defaultSchema = z.object({});

  // Use the schema for the selected command, or fallback to default
  const currentSchema = commandDefinition?.schema || defaultSchema;

  // Infer form data type from schema
  type FormData = z.infer<typeof currentSchema>;

  // React Hook Form setup for command parameters
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(currentSchema as any),
    mode: "onChange",
  });

  // Handle command selection change
  const handleCommandChange = (value: string) => {
    setSelectedCommand(value);
    setParamsValues({});
    reset();
  };

  // Handle parameter value change
  const handleParamChange = (paramId: string, value: string | number) => {
    setParamsValues((prev) => ({
      ...prev,
      [paramId]: value,
    }));
  };

  // Check if exist path param and validate
  const checkPathParam = (values: Record<string, string | number>) => {
    const path = Object.entries(values).find(
      ([key]) => key.toLowerCase().includes("path")
    )?.[1];
    console.log("path", path);
    if (path) {
      // Matches drive letter (C:\), UNC paths (\\server\share), or relative paths with backslashes
      return /^(?:[a-zA-Z]:\\|\\\\[^\\]+\\[^\\]+|(?:\.{1,2}\\)?[^/:*?\"<>|]+\\)+[^/:*?\"<>|]*$/.test(path);
    } else {
      return true; // No path parameter found
    }
  };

  // Execute the selected command with parameters
  const executedCommand = async () => {
    if (!commandDefinition) return;

    setIsExecuting(true);

    try {
      const pathValid = checkPathParam(paramsValues);
      
      if (!pathValid) {
        setErrorMessage("El parámetro de ruta no es válido.");
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

      if (jsonResponse.success) {
        setMessageResponseCommand(jsonResponse.command);
        setMessageResponseResponse(jsonResponse.response);
        setOpenModalResponse(true);
      } else {
        setErrorMessage(
          jsonResponse.error || "Error desconocido al ejecutar el comando."
        );
        setOpenModalError(true);
      }

      reset();
    } catch (error) {
      // Log any errors during execution
      console.log(error);
    } finally {
      setIsExecuting(false);
    }
  };

  // Disable the execute button if not ready
  const isDisabled =
    isExecuting ||
    !commandDefinition ||
    // If the command has parameters, check validity and changes
    (commandDefinition?.params.length > 0 && (!isValid || !isDirty));

  return (
    <>
      {/* Modal to confirm command execution */}
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
      <ModalResponseCommand
        open={openModalResponse}
        onConfirm={() => {
          setOpenModalResponse(false);
        }}
        command={messageResponseCommand}
        response={messageResponseResponse}
      />
      <ModalErrorCommand
        open={openModalError}
        onConfirm={() => {
          setOpenModalError(false);
        }}
        error={errorMessage}
      />
      <Card className="mt-6">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">
                Panel de Control - {server.nombre}
              </CardTitle>
              <CardDescription>
                Ejecuta acciones en este servidor
              </CardDescription>
            </div>
            {/* Close button for the panel */}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              {/* Command selection dropdown with tooltips */}
              <SelectWithTooltip
                id="command-select"
                label="Selecciona un comando"
                options={AVAILABLE_COMMANDS.map((command) => ({
                  id: command.id,
                  label: command.name,
                  description: command.description,
                }))}
                value={selectedCommand}
                onChange={handleCommandChange}
                contentClassName="max-h-[450px]"
              />
            </div>

            {/* Dynamic form for command parameters */}
            <CommandParamsForm
              commandDefinition={commandDefinition as CommandDefinition}
              paramsValues={paramsValues}
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
              {isExecuting ? "Ejecutando..." : "Ejecutar Acción"}
            </Button>

            {/* Placeholder for future logs button */}
            {/* <Button variant="outline">
            <Eye className="mr-2 w-4 h-4" />
            Ver Logs
          </Button> */}
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default ActionPanel;
