import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  id: string;
  label: string;
  description?: string;
}

interface Props {
  id: string;
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  contentClassName?: string;
}


const SelectWithTooltip = ({
  id,
  label,
  options,
  value,
  onChange,
  placeholder,
  className = "w-full",
  contentClassName = "max-h-[200px]",
}: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const resolvedPlaceholder = placeholder ?? t('select') + '...';

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select
        open={open}
        onOpenChange={setOpen}
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id={id} className={className}>
            <SelectValue placeholder={resolvedPlaceholder} />
        </SelectTrigger>
        <SelectContent className={cn("overflow-y-auto", contentClassName)}>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem value={option.id} key={option.id}>
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground leading-tight mt-0.5">
                      {option.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectWithTooltip;
