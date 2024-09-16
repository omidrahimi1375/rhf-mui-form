import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { TextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import type { ReactElement } from "react";
import { forwardRef } from "react";
import type { ReactMaskOpts } from "react-imask";
import { IMaskInput } from "react-imask";

type Props<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
  readonly name: Path<T>;
  readonly control?: Control<T>;
  readonly maskOptions?: ReactMaskOpts;
};

interface TextMaskInputProps {
  readonly onChange: (event: { target: { name: string; value: string } }) => void;
  readonly name: string;
  readonly maskOptions?: ReactMaskOpts;
}

const TextMaskInput = forwardRef<HTMLInputElement, TextMaskInputProps>(function TextMaskInput(
  props: TextMaskInputProps,
  ref
) {
  const { onChange, maskOptions, ...other } = props;

  return (
    <IMaskInput
      {...maskOptions}
      {...other}
      inputRef={ref}
      onAccept={(value: unknown) => {
        onChange({ target: { name: props.name, value: value as string } });
      }}
      overwrite={true}
    />
  );
});

export default function RHFTextMasked<T extends FieldValues>({
  name,
  control,
  maskOptions,
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
          InputProps={{
            ...props.InputProps,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            inputComponent: TextMaskInput,
            inputProps: {
              ...props.InputProps?.inputProps,
              ...maskOptions
            }
          }}
        />
      )}
    />
  );
}
