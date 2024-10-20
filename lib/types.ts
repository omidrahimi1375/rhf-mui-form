export type NotUndefined = object | string | number | boolean | null | NotUndefined[];

export interface SelectOptionBase {
  label: string;
  value: unknown;
  disabled?: boolean;
}
