import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { TextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import type { ReactElement } from "react";

type Props<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
  readonly name: Path<T>;
  readonly control?: Control<T>;
};

export default function RHFTextField<T extends FieldValues>({ name, control, ...props }: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      render={({ field: { value, ...field }, fieldState: { error } }) => (
        <TextField
          fullWidth={true}
          {...props}
          error={props.disabled !== true && error !== undefined}
          helperText={props.disabled !== true && error?.message}
          value={value ?? ""}
          {...field}
        />
      )}
    />
  );
}
