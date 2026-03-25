import { Button, Card } from "@/components/common"
import { type Resolver, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormProvider, RHFTextField } from "@/components/form"
import { RHFDropdown } from "@/components/form/RHFDropdown"

const types = ["smartphone", "server"]
const categories = ["mobile", "idk"]
const conditions = ["used", "new"]

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
})

type FormSchema = {
  type: string
  name: string
  price: number
  stock: number
  condition: string
  category?: string
  brand?: string
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
  }

  const methods = useForm<FormSchema>({
    defaultValues,
    resolver: yupResolver(schema) as Resolver<FormSchema>,
  })

  const { handleSubmit } = methods

  const onSubmit = handleSubmit(data => {
    console.log(data)
  })

  return (
    <FormProvider
      methods={methods}
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

      <div className="flex flex-1 gap-8">
        <Card className="w-full h-fit flex-col flex-1">
          <RHFTextField name="name" label="Name" fullWidth />
          <RHFTextField
            name="password"
            label="Password"
            fullWidth
            type="password"
          />
          <RHFTextField
            name="confirmPassword"
            label="Confirm password"
            fullWidth
            type="password"
          />
          <RHFDropdown name="type" label="Types" fullWidth options={types} />
        </Card>
        <Card className="h-fit flex-1">pepe</Card>
      </div>
    </FormProvider>
  )
}
