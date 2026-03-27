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

const types = ["smartphone", "server"]
const categories = ["mobile", "idk"]
const conditions = ["used", "new"]

const specsByType: Record<
  string,
  yup.ObjectSchema<Record<string, SpecValue>>
> = {
  smartphone: yup.object({
    ram: yup.string().required("RAM is required"),
    storage: yup.string().required("Storage is required"),
    processor: yup.string().required("Processor is required"),
  }),
  server: yup.object({
    screenSize: yup.string().required("Screen size is required"),
    battery: yup.string().required("Battery is required"),
  }),
}

type SpecField = { name: string; label: string }

const specFieldsByType: Record<string, SpecField[]> = {
  smartphone: [
    { name: "ram", label: "RAM" },
    { name: "storage", label: "Storage" },
    { name: "processor", label: "Processor" },
  ],
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
    price: 1,
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
      className="flex flex-col w-full gap-8"
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
          <RHFTextField
            name="price"
            label="Price"
            fullWidth
            numeric
            decimalPlaces={2}
            trailingIcon={<Euro size={20} />}
          />
          <RHFDropdown name="type" label="Types" fullWidth options={types} />

          <RHFFileUpload
            name="images"
            accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
          />
        </Card>
        <Card className="h-fit flex-1 flex-col gap-4 min-w-0 overflow-hidden">
          <h2 className="text-lg font-semibold">Specifications</h2>
          {specFields.map(el => (
            <RHFTextField
              key={el.name}
              name={`specs.${el.name}`}
              label={el.label}
              fullWidth
            />
          ))}
        </Card>
      </div>
    </FormProvider>
  )
}
