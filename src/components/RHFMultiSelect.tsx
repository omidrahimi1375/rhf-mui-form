import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { SelectProps } from "@mui/material";
import { Checkbox, Chip, Stack, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
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
  readonly dir?: "rtl" | "ltr";
  readonly maxHeight?: string;
  readonly dropDownMaxHeight?: number;
};

export default function RHFMultiSelect<T extends FieldValues>({
  name,
  options,
  control,
  dir = "rtl",
  maxHeight,
  dropDownMaxHeight,
  ...props
}: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      render={({ field: { value, ...field }, fieldState: { error } }) => (
        <FormControl fullWidth={true} disabled={props.disabled}>
          <InputLabel>{props.label}</InputLabel>
          <Select
            {...props}
            error={error !== undefined}
            value={value ?? ""}
            {...field}
            multiple={true}
            MenuProps={{
              ...props.MenuProps,
              PaperProps: {
                ...props.MenuProps?.PaperProps,
                style: {
                  maxHeight: dropDownMaxHeight,
                  ...props.MenuProps?.PaperProps?.style
                }
              }
            }}
            renderValue={(selected) =>
              maxHeight === undefined ? (
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {(selected as string[]).map((selectValue) => (
                    <Chip key={selectValue} label={options.find((option) => option.id === selectValue)?.label} />
                  ))}
                </Stack>
              ) : (
                <Stack dir="ltr" className="scrollbar" maxHeight={maxHeight} pl={1} sx={{ overflowY: "auto" }}>
                  <Stack dir="rtl" direction="row" flexWrap="wrap" gap={1}>
                    {(selected as string[]).map((selectValue) => (
                      <Chip key={selectValue} label={options.find((option) => option.id === selectValue)?.label} />
                    ))}
                  </Stack>
                </Stack>
              )
            }
          >
            {options.map((option) => (
              <MenuItem value={option.id} key={option.id} disabled={option.disabled} dir={dir}>
                <Checkbox checked={(value as (number | string)[]).includes(option.id)} />
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
