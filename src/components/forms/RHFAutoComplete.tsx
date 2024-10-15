import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { AutocompleteProps, TextFieldProps } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material";
import type { ReactElement } from "react";
import { useMemo } from "react";
import type { SelectOptionBase } from "./types.ts";

interface OptionItem extends SelectOptionBase {
  value: string;
}

type Props<
  T extends FieldValues,
  Value = OptionItem,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
> = Omit<AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo>, "name" | "renderInput"> & {
  /** The name of the field in the form state */
  readonly name: Path<T>;
  /** The label for the input field, which will be displayed as a floating label. */
  readonly label: string;
  /** The options to be displayed in the autocomplete dropdown. */
  readonly options: OptionItem[];
  /** The control object from React Hook Form, optional if useFormContext is used */
  readonly control?: Control<T>;
  /** Optional: Specifies the text direction for the input field (left-to-right or right-to-left). */
  readonly inputDir?: "ltr" | "rtl";
  /** Optional: Specifies the maximum height of the autocomplete dropdown. */
  readonly maxHeight?: number;
  /** Optional: Specifies the maximum height of the dropdown list in the autocomplete. */
  readonly dropDownMaxHeight?: number;
  /** Optional: Props to be passed to the underlying `TextField` component used in the `renderInput` function. */
  readonly renderInputProps?: Omit<TextFieldProps, "name">;
};

/**
 * `RHFAutoComplete` is a reusable autocomplete component integrated with React Hook Form.
 * It allows for form-controlled selection of options via React Hook Form's `Controller` component.
 *
 * - Supports single or multiple option selections based on the `Autocomplete` component.
 * - Handles various input props such as `inputDir`, dropdown height, and form validation.
 * - Uses `useMemo` to optimize the rendering of option values in the dropdown.
 *
 * @template T - A generic type for the form's field values, extending `FieldValues`.
 * @template Value - A generic type for the selected value in the autocomplete, defaults to `OptionItem`.
 * @template Multiple - A boolean type to handle multiple selections.
 * @template DisableClearable - A boolean to disable the clear button.
 * @template FreeSolo - A boolean to allow free-form input text.
 *
 * @param {Path<T>} name - The name of the field in the form state.
 * @param {string} label - The label to be displayed for the input field.
 * @param {OptionItem[]} options - The list of options to be shown in the autocomplete dropdown.
 * @param {Control<T>} [control] - The React Hook Form control object. If not provided, `useFormContext` is used to access the form control.
 * @param {"ltr" | "rtl"} [inputDir] - The direction of the text input field.
 * @param {number} [maxHeight] - The maximum height of the autocomplete dropdown.
 * @param {number} [dropDownMaxHeight] - The maximum height of the dropdown list.
 * @param {TextFieldProps} [renderInputProps] - Additional props to pass to the underlying MUI `TextField`.
 * @param {AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo>} props - Additional props passed to the `Autocomplete` component.
 *
 * @returns {ReactElement} A controlled `Autocomplete` component integrated with React Hook Form.
 *
 * @example
 * ```tsx
 * <RHFAutoComplete
 *   name="category"
 *   label="Category"
 *   options={categoryOptions}
 *   control={control}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RHFAutoComplete
 *   name="tags"
 *   label="Tags"
 *   options={tagOptions}
 *   control={control}
 *   multiple
 * />
 * ```
 */
export default function RHFAutoComplete<T extends FieldValues>({
  name,
  label,
  options,
  control,
  inputDir,
  maxHeight,
  dropDownMaxHeight,
  renderInputProps,
  ...props
}: Props<T>): ReactElement {
  const formContext = useFormContext<T>();

  // TODO: Complete maxHeight, dropDownMaxHeight and inputDir

  const innerOptions = useMemo(() => {
    const result: Record<string, OptionItem> = {};

    for (const o of options) {
      result[o.value] = o;
    }

    return result;
  }, [options]);

  return (
    <Controller
      name={name}
      control={control ?? formContext.control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <Autocomplete
          fullWidth={true}
          {...props}
          value={value !== undefined && value !== null ? innerOptions[value] : null}
          onChange={(_, newValue) => {
            onChange(newValue !== null ? newValue.value : null);
          }}
          getOptionLabel={(option) => option.label}
          options={options}
          isOptionEqualToValue={(option, val) => {
            return option.value === val.value;
          }}
          renderInput={(params) => (
            <TextField
              {...renderInputProps}
              {...params}
              label={label}
              inputRef={ref}
              error={props.disabled !== true && error !== undefined}
              helperText={
                props.disabled !== true && error?.message !== undefined && error.message.length > 0
                  ? error.message
                  : renderInputProps?.helperText !== undefined
                    ? renderInputProps.helperText
                    : " "
              }
            />
          )}
        />
      )}
    />
  );
}
