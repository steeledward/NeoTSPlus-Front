import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useId } from "react";

interface Props {
  command: string;
  response: string;
  open: boolean;
  onConfirm: () => void;
}

const ModalConfirmCommand = ({ open, onConfirm, command, response }: Props) => {
  const descriptionId = useId();
  return (
    <AlertDialog open={open}>
      <AlertDialogContent aria-describedby={descriptionId}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Resultado al ejecutar comando
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription id={descriptionId} className="mb-2">
          El siguiente resultado se muestra en formato de terminal para mayor claridad y accesibilidad.
        </AlertDialogDescription>
        <div
          className="bg-black text-green-400 font-mono rounded p-4 text-sm max-h-64 overflow-auto border border-gray-700 shadow-inner"
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          data-testid="shell-output"
        >
          $ {command}
          <br />$ {response}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm}>Enterado</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalConfirmCommand;
