import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { DateTimePickerProps } from "@mui/x-date-pickers";
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import type { ReactElement } from "react";

type Props<T extends FieldValues> = Omit<DateTimePickerProps<Date>, "name"> & {
  readonly name: Path<T>;
  readonly control?: Control<T>;
};

export default function RHFDateTimePicker<T extends FieldValues>({ name, control, ...props }: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      render={({ field: { value, ...field }, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
          <DateTimePicker
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock
            }}
            // TODO: Make it i18n ready
            localeText={{
              okButtonLabel: "تایید",
              cancelButtonLabel: "انصراف",
              toolbarTitle: "انتخاب روز و ساعت"
            }}
            sx={{ width: "100%", ...props.sx }}
            {...props}
            slotProps={{
              textField: {
                error: error !== undefined,
                helperText: error?.message
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
