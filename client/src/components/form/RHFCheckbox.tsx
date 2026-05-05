import type { PathValue } from "react-hook-form"
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import type { ComponentProps } from "react"
import { Checkbox } from "../common/Checkbox"

type CheckboxProps = ComponentProps<typeof Checkbox>
type RHFCheckboxProps<T extends FieldValues> = { name: FieldPath<T> } & Omit<
  CheckboxProps,
  "onChange" | "checked"
>

export const RHFCheckbox = <T extends FieldValues>({
  name,
  ...props
}: RHFCheckboxProps<T>) => {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<T>()
  const value = watch(name) as boolean

  const error = name.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc)
      return (acc as Record<string, unknown>)[key]
    return undefined
  }, errors)
  const hasError = !!(error && typeof error === "object" && "message" in error)

  return (
    <Checkbox
      {...props}
      checked={value}
      hasError={hasError}
      onChange={checked => {
        setValue(name, checked as PathValue<T, FieldPath<T>>)
        void trigger(name)
      }}
    />
  )
}
