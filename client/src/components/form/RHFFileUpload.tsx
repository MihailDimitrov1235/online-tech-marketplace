import {
  useFormContext,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from "react-hook-form"
import { FileUpload, type UploadedFile } from "../common/FileUpload"
import type { ComponentProps } from "react"

type FileUploadProps = ComponentProps<typeof FileUpload>

type RHFFileUploadProps<T extends FieldValues> = Omit<
  FileUploadProps,
  "files" | "setFiles"
> & {
  name: FieldPath<T>
}

export const RHFFileUpload = <T extends FieldValues>({
  name,
  ...props
}: RHFFileUploadProps<T>) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<T>()

  const files: UploadedFile[] = watch(name) ?? []

  const setFiles: React.Dispatch<
    React.SetStateAction<UploadedFile[]>
  > = action => {
    const next = typeof action === "function" ? action(files) : action
    setValue(name, next as PathValue<T, FieldPath<T>>, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

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
    <div className="flex flex-col gap-1">
      <label
        className={`font-medium text-sm capitalize ${errorMessage ? "text-red-500" : "text-contrast/70"}`}
      >
        {name}
      </label>
      <FileUpload {...props} files={files} setFiles={setFiles} />
      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
    </div>
  )
}
