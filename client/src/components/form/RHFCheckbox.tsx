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
  const { setValue, watch } = useFormContext<T>()
  const value = watch(name) as boolean
  return (
    <Checkbox
      {...props}
      checked={value}
      onChange={checked => {
        setValue(name, checked as PathValue<T, FieldPath<T>>)
      }}
    />
  )
}
