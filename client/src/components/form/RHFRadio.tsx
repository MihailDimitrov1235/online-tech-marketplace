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
  const { setValue, watch } = useFormContext<T>()
  const value = watch(name) as string
  return (
    <Radio
      {...props}
      checked={value === props.value}
      onChange={val => {
        setValue(name, val as PathValue<T, FieldPath<T>>)
      }}
    />
  )
}
