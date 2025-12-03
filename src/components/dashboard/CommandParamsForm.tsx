import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { CommandDefinition } from "@/types/command.types";
import { useTranslation } from "react-i18next";
import {
  Controller,
  type UseFormRegister,
  type Control,
} from "react-hook-form";

type Props = {
  commandDefinition: CommandDefinition;
  paramsValues: Record<string, string | boolean | undefined>;
  handleParamChange: (paramId: string, value: string | number | boolean) => void;
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: any;
};

const CommandParamsForm = ({
  commandDefinition,
  paramsValues,
  handleParamChange,
  control,
  errors,
}: Props) => {
  const { t } = useTranslation();
  return (
    <>
      {commandDefinition && commandDefinition.params.length > 0 && (
        <>
          {/* // * We could use this later */}
          {/* <h3>{commandDefinition.name}</h3> */}
          {commandDefinition.params.map((param) => (
            <div key={param.id} className="space-y-2">
              <Label htmlFor={`param-${param.id}`}>
                {param.name}
                {!param.optional && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {param.selectOptions ? (
                <Controller
                  name={param.id}
                  control={control}
                  defaultValue={(paramsValues[param.id] as string | undefined) || ""}
                  rules={!param.optional ? { required: (t('field_required') as unknown as string) } : undefined}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleParamChange(param.id, value);
                      }}
                      {...(!param.optional ? { 'aria-required': true } : { 'aria-required': false })}
                      aria-invalid={!!errors[param.id]}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={param.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {param.selectOptions?.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : param.type === "boolean" ? (
                <Controller
                  name={param.id}
                  control={control}
                  defaultValue={paramsValues[param.id] ?? false}
                  render={({ field }) => (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <input
                          id={`param-${param.id}-yes`}
                          type="radio"
                          checked={!!field.value === true}
                          onChange={() => {
                            field.onChange(true);
                            handleParamChange(param.id, true);
                          }}
                          className="accent-blue-600 w-4 h-4"
                          {...(!param.optional ? { required: true, 'aria-required': true } : { 'aria-required': false })}
                          aria-invalid={!!errors[param.id]}
                        />
                        <Label htmlFor={`param-${param.id}-yes`}>{t('yes')}</Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          id={`param-${param.id}-no`}
                          type="radio"
                          checked={!!field.value === false}
                          onChange={() => {
                            field.onChange(false);
                            handleParamChange(param.id, false);
                          }}
                          className="accent-blue-600 w-4 h-4"
                          {...(!param.optional ? { required: true, 'aria-required': true } : { 'aria-required': false })}
                          aria-invalid={!!errors[param.id]}
                        />
                        <Label htmlFor={`param-${param.id}-no`}>{t('no')}</Label>
                      </div>
                    </div>
                  )}
                />
              ) : (
                <Controller
                  name={param.id}
                  control={control}
                  defaultValue={(paramsValues[param.id] as string | undefined) || ""}
                  render={({ field }) => (
                    <Input
                      id={`param-${param.id}`}
                      type={param.type}
                      value={field.value}
                      {...(!param.optional ? { required: true, 'aria-required': true } : { 'aria-required': false })}
                      aria-invalid={!!errors[param.id]}
                      min={param.type === "number" ? 0 : undefined}
                      placeholder={param.placeholder}
                      className="focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        const value =
                          param.type === "number"
                            ? Number(e.target.value)
                            : e.target.value;
                        field.onChange(value);
                        handleParamChange(param.id, value);
                      }}
                    />
                  )}
                />
              )}
              <span className="relative left-1.5 text-xs text-red-500" aria-live="polite">
                {errors[param.id]?.message}
              </span>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default CommandParamsForm;
