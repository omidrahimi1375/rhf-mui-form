import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { CheckboxProps } from "@mui/material";
import { Checkbox, FormControl, FormControlLabel, FormHelperText } from "@mui/material";
import type { ReactElement } from "react";

type Props<T extends FieldValues> = Omit<CheckboxProps, "name"> & {
  readonly name: Path<T>;
  readonly label: string;
  readonly control?: Control<T>;
};

export default function RHFCheckBox<T extends FieldValues>({ name, label, control, ...props }: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
        <FormControl error={error !== undefined}>
          <FormControlLabel
            control={
              <Checkbox
                {...props}
                {...field}
                checked={value === true}
                onChange={(e) => {
                  onChange(e.target.checked);
                }}
              />
            }
            label={label}
          />
          <FormHelperText sx={{ color: "red" }}>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
