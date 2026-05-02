import {
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form"

export const RHFRadioGroup = <T extends FieldValues>({
  name,
  label,
  children,
}: {
  name: FieldPath<T>
  label?: string
  children: React.ReactNode
}) => {
  const {
    formState: { errors },
  } = useFormContext<T>()
  const error = name.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc)
      return (acc as Record<string, unknown>)[key]
    return undefined
  }, errors)
  const errorMessage =
    error && typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : undefined

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p
          className={`text-sm font-medium  ${errorMessage ? "text-error" : "text-contrast"}`}
        >
          {label}
        </p>
      )}
      <div className="flex gap-6">{children}</div>
      {errorMessage && <p className="text-xs text-error">{errorMessage}</p>}
    </div>
  )
}
