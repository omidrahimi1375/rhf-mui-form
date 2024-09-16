import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { DatePickerProps } from "@mui/x-date-pickers";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import type { ReactElement } from "react";

type Props<T extends FieldValues> = Omit<DatePickerProps<Date>, "name"> & {
  readonly name: Path<T>;
  readonly control?: Control<T>;
  readonly invalidDateMessage?: string;
  readonly readonlyInput?: boolean;
};

export default function RHFDatePicker<T extends FieldValues>({
  name,
  control,
  invalidDateMessage,
  readonlyInput = true,
  ...props
}: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      render={({ field: { value, ...field }, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
          <DatePicker
            sx={{ width: "100%", ...props.sx }}
            {...props}
            slotProps={{
              field: {
                readOnly: readonlyInput
              },
              textField: {
                error: error !== undefined,
                helperText:
                  error?.message === "Invalid date" && invalidDateMessage !== undefined
                    ? invalidDateMessage
                    : error?.message
              }
            }}
            value={value ?? null}
            {...field}
          />
        </LocalizationProvider>
      )}
    />
  );
}
