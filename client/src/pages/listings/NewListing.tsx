import { Button, Card } from "@/components/common"
import { type Resolver, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormProvider, RHFTextField } from "@/components/form"
import { RHFDropdown } from "@/components/form/RHFDropdown"
import { Euro } from "lucide-react"
import { RHFFileUpload } from "@/components/form/RHFFileUpload"
import { type UploadedFile } from "@/components/common/FileUpload"
import type { SpecValue } from "@/types/product"
import type { ComponentProps } from "react"
import {
  smartphoneFields,
  smartphoneSchema,
} from "@/components/listings/Smartphone"
import { SpecFormRenderer } from "@/components/listings/SpecFormRenderer"

const types = ["smartphone", "server"]
const categories = ["mobile", "idk"]
const conditions = ["used", "new"]

type TextfieldProps = ComponentProps<typeof RHFTextField>
export type SpecField = Omit<TextfieldProps, "children" | "name" | "label"> & {
  name: string
  label: string
  children?: SpecField[]
  values?: string[]
}

const specsByType: Record<
  string,
  yup.ObjectSchema<Record<string, SpecValue>>
> = {
  smartphone: smartphoneSchema,
  server: yup.object({
    screenSize: yup.string().required("Screen size is required"),
    battery: yup.string().required("Battery is required"),
  }),
}

const specFieldsByType: Record<string, SpecField[]> = {
  smartphone: smartphoneFields,
  server: [
    { name: "screenSize", label: "Screen Size" },
    { name: "battery", label: "Battery" },
  ],
}

const schema = yup.object({
  type: yup
    .string()
    .oneOf(types, "Select a valid type")
    .required("Type is required"),
  category: yup
    .string()
    .oneOf(categories, "Select a valid category")
    .optional(),
  name: yup.string().required("Name is required"),
  brand: yup.string().optional(),
  price: yup.number().positive().required("Price is required"),
  stock: yup.number().positive().integer().required("Stock is required"),
  condition: yup.string().oneOf(conditions).required("Condition is required"),
  images: yup
    .array()
    .of(yup.mixed<UploadedFile>().required())
    .min(1, "Upload at least one image")
    .required(),
  specs: yup.lazy((_, options) => {
    const type = (options.parent as { type?: string }).type
    if (!type || !(type in specsByType)) return yup.object()
    return specsByType[type] as yup.ObjectSchema<yup.AnyObject>
  }),
})

type FormSchema = {
  type: string
  name: string
  price: number
  stock: number
  condition: string
  category?: string
  brand?: string
  images: UploadedFile[]
  specs: object
}

export default function NewListing() {
  const defaultValues = {
    type: "",
    category: "",
    name: "",
    brand: "",
    price: 0,
    stock: 1,
    condition: "",
    images: [],
    specs: {},
  }

  const methods = useForm<FormSchema>({
    defaultValues,
    resolver: yupResolver(schema) as Resolver<FormSchema>,
  })

  const { handleSubmit, watch } = methods
  const type = watch("type")
  const specFields = type ? specFieldsByType[type] : []

  const onSubmit = handleSubmit(data => {
    console.log(data)
  })

  return (
    <FormProvider
      methods={methods}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={onSubmit}
      className="flex flex-col w-full gap-8 px-14 pt-8"
    >
      <Card className="items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Add a listing
        </h1>
        <Button type="submit" variant="primary" className="ml-auto" size="lg">
          Create Listing
        </Button>
      </Card>

      <div className="flex flex-1 gap-8 ">
        <Card className="w-full h-fit flex-col flex-1 gap-4 min-w-0 overflow-hidden">
          <h2 className="text-lg font-semibold">Main fields</h2>
          <RHFTextField name="name" label="Name" fullWidth />
          <RHFTextField name="brand" label="Brand" fullWidth />
          <RHFTextField
            name="price"
            label="Price"
            fullWidth
            numeric
            decimalPlaces={2}
            trailingIcon={<Euro size={20} />}
          />
          <RHFTextField
            name="stock"
            label="Stock"
            fullWidth
            numeric
            decimalPlaces={0}
          />
          <RHFDropdown
            name="category"
            label="Category"
            fullWidth
            options={categories}
          />

          <RHFDropdown name="type" label="Types" fullWidth options={types} />
          <RHFDropdown
            name="condition"
            label="Condition"
            fullWidth
            options={conditions}
          />

          <RHFFileUpload
            name="images"
            accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
          />
        </Card>
        <Card className="h-fit flex-1 flex-col gap-4 min-w-0 ">
          <h2 className="text-lg font-semibold">Specifications</h2>
          <SpecFormRenderer fields={specFields} prefix="specs" />
        </Card>
      </div>
    </FormProvider>
  )
}
