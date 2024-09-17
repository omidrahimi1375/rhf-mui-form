import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { InputBaseComponentProps, TextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import type { ReactElement } from "react";
import { forwardRef } from "react";
import type { ReactMaskOpts } from "react-imask";
import { IMaskInput } from "react-imask";

type Props<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
  readonly name: Path<T>;
  readonly control?: Control<T>;
  readonly maskOptions?: ReactMaskOpts;
  readonly inputDir?: "ltr" | "rtl";
};

interface TextMaskInputProps extends InputBaseComponentProps {
  readonly maskOptions?: ReactMaskOpts;
}

const TextMaskInput = forwardRef<HTMLInputElement, TextMaskInputProps>(function TextMaskInput(
  props: TextMaskInputProps,
  ref
) {
  const { maskOptions, ...other } = props;

  return (
    <IMaskInput
      {...maskOptions}
      {...other}
      inputRef={ref}
      // onAccept={(value: unknown) => {
      //   onChange({ target: { name: props.name, value: value as string } });
      // }}
    />
  );
});

export default function RHFTextMasked<T extends FieldValues>({
  name,
  control,
  maskOptions,
  inputDir = "rtl",
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
          error={error !== undefined}
          helperText={error?.message}
          value={value ?? ""}
          {...field}
          inputProps={{
            ...props.inputProps,
            style: {
              direction: inputDir,
              ...props.inputProps?.style
            }
          }}
          InputProps={{
            ...props.InputProps,
            inputComponent: TextMaskInput,
            inputProps: {
              ...props.InputProps?.inputProps,
              style: {
                direction: inputDir,
                ...props.InputProps?.inputProps?.style
              },
              maskOptions
            }
          }}
        />
      )}
    />
  );
}
