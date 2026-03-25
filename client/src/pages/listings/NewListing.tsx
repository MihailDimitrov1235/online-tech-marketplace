import { Button, Card } from "@/components/common"
import { type Resolver, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormProvider, RHFTextField } from "@/components/form"
import { Dropdown } from "@/components/common/Dropdown"
import { useState } from "react"

// "type": "smartphone",
// 		"category": "mobile",
// 		"name": "Cocaine",
// 		"brand": "Samsung",
// 		"price": 67.67,
// 		"stock": 69,
// 		"condition": "used",
// 		"images": [
// 			"https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg",
// 			"https://pbs.twimg.com/media/G20nX3rW4AAOnhu.jpg"
// 		],
const types = ["smartphone", "server"]
const categories = ["mobile", "idk"]
const conditions = ["used", "new"]

const schema = yup.object({
  type: yup.string().oneOf(types).required("Type is required"),
  category: yup.string().oneOf(categories).optional(),
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

  const [val, setval] = useState(types[0])

  return (
    <div className="flex flex-col w-full gap-8">
      <Card className="items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Add a listing
        </h1>
        <Button type="submit" variant="primary" className="ml-auto" size="lg">
          Create Listing
        </Button>
      </Card>

      <FormProvider
        methods={methods}
        onSubmit={onSubmit}
        className="flex flex-1 gap-8"
      >
        <Card className="w-full h-fit flex-col flex-1">
          <RHFTextField name="username" label="Username" fullWidth />
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
          <Dropdown fullWidth options={types} value={val} onChange={setval} />
        </Card>
        <Card className="h-fit flex-1">pepe</Card>
      </FormProvider>
    </div>
  )
}
