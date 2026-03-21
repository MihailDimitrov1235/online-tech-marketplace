import type { SpecValue } from "@/types/product"

function SpecValueRenderer({
  value,
  depth = 0,
}: {
  value: SpecValue
  depth?: number
}) {
  if (typeof value === "string" || typeof value === "number") {
    return <span className="text-md text-contrast/90">{String(value)}</span>
  }

  if (typeof value === "boolean") {
    return (
      <span
        className={`text-md font-medium ${value ? "text-green-600" : "text-error"}`}
      >
        {value ? "Yes" : "No"}
      </span>
    )
  }

  if (Array.isArray(value)) {
    return (
      <ul className="mt-1 ml-4 list-disc space-y-0.5">
        {value.map((item, i) => (
          <li key={i} className="text-md">
            <SpecValueRenderer value={item} depth={depth + 1} />
          </li>
        ))}
      </ul>
    )
  }

  // Object / nested Spec
  return (
    <div
      className={
        depth > 0
          ? "mt-1 ml-4 border-l-2 border-contrast/10 pl-3 space-y-3"
          : "space-y-3"
      }
    >
      {Object.entries(value).map(([key, val]) => (
        <SpecEntry key={key} label={key} value={val} depth={depth + 1} />
      ))}
    </div>
  )
}

function SpecEntry({
  label,
  value,
  depth,
}: {
  label: string
  value: SpecValue
  depth: number
}) {
  return (
    <div>
      <p className=" font-semibold text-contrast/80 uppercase text-sm">
        {label.replace(/_/g, " ")}
      </p>
      <SpecValueRenderer value={value} depth={depth} />
    </div>
  )
}

export function SpecRenderer(Spec: Record<string, SpecValue>) {
  return (
    <div className="flex flex-col gap-4">
      {Object.entries(Spec).map(([key, value]) => {
        return (
          <div key={key}>
            <h3 className="text-lg font-semibold text-contrast/80 border-b border-gray-100 pb-1 mb-2 capitalize">
              {key.replace(/_/g, " ")}
            </h3>
            <SpecValueRenderer value={value} depth={1} />
          </div>
        )
      })}
    </div>
  )
}
