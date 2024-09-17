import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { SelectProps } from "@mui/material";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import type { ReactElement } from "react";

interface Option {
  id: number | string;
  label: string;
  disabled?: boolean;
}
type Props<T extends FieldValues> = Omit<SelectProps, "name"> & {
  readonly name: Path<T>;
  readonly options: Option[];
  readonly control?: Control<T>;
};

export default function RHFSelect<T extends FieldValues>({ name, options, control, ...props }: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      render={({ field: { value, ...field }, fieldState: { error } }) => (
        <FormControl fullWidth={true} disabled={props.disabled}>
          <InputLabel>{props.label}</InputLabel>
          <Select {...props} error={error !== undefined} value={value ?? ""} {...field}>
            {options.map((option) => (
              <MenuItem value={option.id} key={option.id} disabled={option.disabled}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {props.disabled !== true ? <FormHelperText sx={{ color: "red" }}>{error?.message}</FormHelperText> : null}
        </FormControl>
      )}
    />
  );
}
