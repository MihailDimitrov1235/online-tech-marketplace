import { UploadIcon, XIcon } from "lucide-react"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "."

export type UploadedFile = {
  id: string
  url?: string
  file?: File
}

type FileUploadProps = {
  accept?: Record<string, string[]>
  maxSizeMB?: number
  maxFiles?: number
  files: UploadedFile[]
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>
}

export const FileUpload = ({
  accept,
  maxSizeMB = 10,
  maxFiles = 10,
  files,
  setFiles,
}: FileUploadProps) => {
  const onDrop = useCallback(
    (accepted: File[]) => {
      const newFiles: UploadedFile[] = [
        ...accepted.map(file => {
          const id = `${file.name}-${Date.now().toString()}-${Math.random().toString()}`
          return { id, file }
        }),
      ]
      setFiles(p => [...p, ...newFiles]) // TODO: fix ability to upload more than limit number of files
    },
    [setFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeMB * 1024 * 1024,
    maxFiles,
    disabled: files.length >= maxFiles,
  })

  const remove = (id: string) => {
    setFiles(p => p.filter(f => f.id !== id))
  }

  const formatSize = (b: number) =>
    b < 1024
      ? `${b.toString()} B`
      : b < 1048576
        ? `${(b / 1024).toFixed(1)} KB`
        : `${(b / 1048576).toFixed(1)} MB`

  const atLimit = files.length >= maxFiles

  return (
    <div className="flex flex-col gap-3">
      <div
        {...getRootProps()}
        className={[
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 select-none ",
          atLimit
            ? "cursor-not-allowed border-zinc-200 opacity-50 "
            : isDragActive
              ? "cursor-copy border-primary/50 bg-primary/5 "
              : "cursor-pointer border-zinc-300 hover:border-primary-tint-border hover:bg-zinc-50",
        ].join(" ")}
      >
        <input {...getInputProps()} />
        <UploadIcon />
        <div>
          <p className="text-sm font-medium text-contrast">
            {isDragActive
              ? "Drop to upload"
              : "Drag files here or click to browse"}
          </p>
          <p className="text-xs text-contrast/50 mt-0.5">
            Up to {maxSizeMB} MB · {maxFiles} files max
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map(entry => (
            <FileRow
              key={entry.id}
              entry={entry}
              onRemove={() => {
                remove(entry.id)
              }}
              formatSize={formatSize}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

type FileRowProps = {
  entry: UploadedFile
  onRemove: () => void
  formatSize: (bytes: number) => string
}

const FileRow = ({ entry, onRemove, formatSize }: FileRowProps) => {
  const { url, file } = entry
  const ext =
    file?.name.split(".").pop()?.toLowerCase() ??
    url?.split(".").pop()?.toLowerCase() ??
    ""

  return (
    <li className="flex items-center gap-3 rounded-lg border border-neutral/80 bg-white/60 px-3 py-2.5 text-sm overflow-hidden">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[10px] font-bold uppercase bg-blue-100 text-blue-600 dark:bg-blue-900/70 dark:text-blue-200`}
      >
        {url ? (
          <img className="aspect-square object-cover" src={url} />
        ) : ext ? (
          ext.slice(0, 4)
        ) : (
          "?"
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <span className="truncate font-medium text-contrast text-xs">
          {file?.name}
        </span>

        <span className="text-xs text-contrast/40">
          {formatSize(file?.size ?? 0)}
        </span>
      </div>

      <Button
        onClick={onRemove}
        className="rounded-full p-1 text-contrast/40 hover:text-error transition-colors"
        variant="ghost"
        size="icon"
      >
        <XIcon />
      </Button>
    </li>
  )
}
