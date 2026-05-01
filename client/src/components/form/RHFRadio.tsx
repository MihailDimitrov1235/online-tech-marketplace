import type { PathValue } from "react-hook-form"
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import type { ComponentProps } from "react"
import { Radio } from "../common/Radio"

type RadioProps = ComponentProps<typeof Radio>
type RHFRadioProps<T extends FieldValues> = { name: FieldPath<T> } & Omit<
  RadioProps,
  "onChange"
>

export const RHFRadio = <T extends FieldValues>({
  name,
  ...props
}: RHFRadioProps<T>) => {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<T>()
  const value = watch(name) as string

  const error = name.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc)
      return (acc as Record<string, unknown>)[key]
    return undefined
  }, errors)
  const hasError = !!(error && typeof error === "object" && "message" in error)

  return (
    <Radio
      {...props}
      checked={value === props.value}
      hasError={hasError}
      onChange={val => {
        setValue(name, val as PathValue<T, FieldPath<T>>)
        void trigger(name)
      }}
    />
  )
}
