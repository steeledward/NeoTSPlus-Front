import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  command: string;
  response: string;
  open: boolean;
  onConfirm: () => void;
}

const ModalConfirmCommand = ({ open, onConfirm, command, response }: Props) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Resultado al ejecutar comando
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 text-md">
            {command}
          </AlertDialogDescription>
          <AlertDialogDescription className="text-gray-600 text-md">
            {response}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm}>Enterado</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalConfirmCommand;
