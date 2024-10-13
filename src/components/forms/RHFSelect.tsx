import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { SelectProps } from "@mui/material";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import type { ReactElement } from "react";
import { useMemo } from "react";
import objectHash from "object-hash";

type NotUndefined = object | string | number | boolean | null | NotUndefined[];

interface OptionItem {
  label: string;
  value: NotUndefined;
  disabled?: boolean;
}

type Props<T extends FieldValues> = Omit<SelectProps, "name"> & {
  readonly name: Path<T>;
  readonly options: OptionItem[];
  readonly control?: Control<T>;
};

export default function RHFSelect<T extends FieldValues>({ name, options, control, ...props }: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  const innerOptions = useMemo(() => {
    const result: Record<string, OptionItem> = {};

    for (const o of options) {
      result[objectHash(o.value)] = o;
    }

    return result;
  }, [options]);

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
        // TODO: we can move it up somehow to not run in every select onChange.
        if (!(objectHash(value) in innerOptions)) {
          throw new Error("This value is not present in the options: ", value);
        }

        return (
          <FormControl fullWidth={true} disabled={props.disabled} error={error !== undefined}>
            <InputLabel>{props.label}</InputLabel>
            <Select
              {...props}
              error={error !== undefined}
              value={value === undefined ? "" : objectHash(value)}
              {...field}
              onChange={(event) => {
                onChange(innerOptions[event.target.value as string].value);
              }}
            >
              {Object.entries(innerOptions).map(([hash, option]) => (
                <MenuItem value={hash} key={hash} disabled={option.disabled}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{error?.message ?? " "}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}
