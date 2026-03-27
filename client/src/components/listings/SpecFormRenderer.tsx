import type { SpecField } from "@/pages/listings/NewListing"
import { RHFDropdown } from "../form/RHFDropdown"
import { RHFTextField } from "../form"

export const SpecFormRenderer = ({
  fields,
  prefix,
}: {
  fields: SpecField[]
  prefix: string
}) => (
  <>
    {fields.map(field => {
      const { name, label, children, values, ...rest } = field
      const fieldName = `${prefix}.${name}`

      if (children) {
        return (
          <div key={name}>
            <p className="text-sm font-medium text-zinc-700 capitalize">
              {label}
            </p>
            <div className="flex flex-col gap-4 pl-4 mt-2">
              <SpecFormRenderer fields={children} prefix={fieldName} />
            </div>
          </div>
        )
      }

      if (values) {
        return (
          <RHFDropdown
            key={name}
            name={fieldName}
            label={label}
            options={values}
            fullWidth
          />
        )
      }

      return (
        <RHFTextField
          key={name}
          name={fieldName}
          label={label}
          fullWidth
          {...rest}
        />
      )
    })}
  </>
)
