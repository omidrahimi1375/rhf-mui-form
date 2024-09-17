import type { Control, FieldValues, Path, PathValue } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";
import type { ReactElement } from "react";
import type { Option } from "@/types";

interface Props<T extends FieldValues> {
  readonly name: Path<T>;
  readonly label: string;
  readonly options: Option[];
  readonly control?: Control<T>;
  readonly noOptionsText?: string;
}

export default function RHFAutoComplete<T extends FieldValues>({
  name,
  label,
  options,
  control,
  noOptionsText
}: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  const findValue = (val: PathValue<T, Path<T>>): Option | undefined => {
    return options.find((option) => {
      return val === option.id;
    });
  };

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <Autocomplete
          fullWidth={true}
          // TODO: Make it i18n ready
          noOptionsText={noOptionsText ?? "موردی یافت نشد"}
          value={value !== undefined && value !== null ? (findValue(value) ?? null) : null}
          getOptionLabel={(option) => option.label}
          onChange={(_, newValue) => {
            onChange(newValue !== null ? newValue.id : "");
          }}
          options={options}
          isOptionEqualToValue={(option, val) => {
            return option.id === val.id;
          }}
          // getOptionSelected={(option: Option, item: Option) => option.id === item.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              inputRef={ref}
              error={error !== undefined}
              helperText={error?.message}
            />
          )}
        />
      )}
    />
  );
}
