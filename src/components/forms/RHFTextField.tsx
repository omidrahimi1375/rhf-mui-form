import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { TextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import type { ReactElement } from "react";

type Props<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
  readonly name: Path<T>;
  readonly control?: Control<T>;
  readonly inputDir?: "ltr" | "rtl";
  readonly isReadOnly?: boolean;
};

export default function RHFTextField<T extends FieldValues>({
  name,
  control,
  inputDir,
  isReadOnly,
  ...props
}: Props<T>): ReactElement {
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
          slotProps={{
            ...props.slotProps,
            input: {
              readOnly: isReadOnly,
              ...props.slotProps?.input
            },
            htmlInput: {
              ...props.slotProps?.htmlInput,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              style: {
                direction: inputDir,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                ...props.slotProps?.htmlInput?.style
              }
            }
          }}
        />
      )}
    />
  );
}
