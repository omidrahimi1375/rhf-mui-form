import type { ReactElement } from "react";
import type { RadioGroupProps } from "@mui/material";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, FormHelperText } from "@mui/material";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { Option } from "@/types";

type Props<T extends FieldValues> = Omit<RadioGroupProps, "name"> & {
  readonly name: Path<T>;
  readonly options: Option[];
  readonly label?: string;
  readonly control?: Control<T>;
};

export default function RHFRadioGroup<T extends FieldValues>({
  name,
  options,
  label,
  control,
  ...props
}: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={error !== undefined}>
          {label !== undefined ? <FormLabel>{label}</FormLabel> : null}
          <RadioGroup {...props} {...field}>
            {options.map((option) => (
              <FormControlLabel key={option.id} value={option.id} control={<Radio />} label={option.label} />
            ))}
          </RadioGroup>
          <FormHelperText sx={{ color: "red" }}>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
