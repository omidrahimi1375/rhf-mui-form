import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { TextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import type { ReactElement } from "react";

type Props<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
  /** The name of the field in the form state */
  readonly name: Path<T>;
  /** The control object from React Hook Form, optional if useFormContext is used */
  readonly control?: Control<T>;
  /** Direction of the text input (left-to-right or right-to-left) */
  readonly inputDir?: "ltr" | "rtl";
  /** Whether the field is read-only */
  readonly isReadOnly?: boolean;
};

/**
 * `RHFTextField` is a wrapper around MIUI's `TextField` that integrates with React Hook Form.
 * - It only works with controlled fields in React Hook Form (RHF).
 * - The component can either receive the RHF control as a prop or use `useFormContext` to automatically access the form control.
 *
 * @template T - A generic type for the form's field values, extending `FieldValues`.
 *
 * @param {Path<T>} name - The name of the field in the form state.
 * @param {Control<T>} [control] - The React Hook Form control object. If not provided, the form context will be used.
 * @param {"ltr" | "rtl"} [inputDir] - The text direction for the input. Can be "ltr" (left-to-right) or "rtl" (right-to-left).
 * @param {boolean} [isReadOnly] - Specifies whether the input is read-only.
 * @param {TextFieldProps} props - Additional props passed to the underlying MUI `TextField`.
 *
 * @returns A controlled `TextField` component integrated with React Hook Form.
 */
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
          helperText={
            props.disabled !== true && error?.message !== undefined && error.message.length > 0
              ? error.message
              : props.helperText !== undefined
                ? props.helperText
                : " "
          }
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
