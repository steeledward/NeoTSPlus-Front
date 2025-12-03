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
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onConfirm: () => void;
}

/**
 * ModalSuccessCommand
 * A small, reusable success/response modal. Uses the project's AlertDialog primitives
 * and supports i18n via react-i18next. Accepts optional title/message to display.
 */
const ModalSuccessCommand = ({ open, onConfirm }: Props) => {
  const descriptionId = useId();
  const { t } = useTranslation();

  return (
    <AlertDialog open={open}>
      <AlertDialogContent aria-describedby={descriptionId}>
        <AlertDialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-100 text-green-700">
              <Check className="w-5 h-5" />
            </div>
            <AlertDialogTitle className="text-xl">
              {t("command_result")}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription id={descriptionId} className="mb-4">
          {t("action_panel_success")}
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm}>
            {t("Acknowledge")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalSuccessCommand;
