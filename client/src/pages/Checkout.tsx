import api from "@/api/axiosInstance"
import { Button, Card } from "@/components/common"
import { FormProvider, RHFTextField } from "@/components/form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { useNavigate } from "react-router"
import { paths } from "@/router"

type CheckoutForm = {
  address: {
    country: string
    city: string
    street: string
    zip: number
  }
}

const schema = yup.object({
  address: yup.object({
    country: yup.string().required("Country is required"),
    city: yup.string().required("City is required"),
    street: yup.string().required("Street is required"),
    zip: yup.number().positive().required("Zip code is required"),
  }),
})

export default function Checkout() {
  const navigate = useNavigate()
  const defaultValues = {
    address: {
      country: "",
      city: "",
      street: "",
      zip: undefined,
    },
  }

  const methods = useForm<CheckoutForm>({
    defaultValues,
    resolver: yupResolver(schema),
  })

  const { handleSubmit } = methods

  const onSubmit = handleSubmit(data => {
    api
      .post("/orders", data)
      .then(async res => {
        console.log(res.data)
        await navigate(paths.orders.root)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  })

  return (
    <div className="flex flex-col items-center text-contrast mt-8 gap-8">
      <span className="text-2xl font-bold">Checkout</span>
      <Card className="w-300">
        <FormProvider
          methods={methods}
          onSubmit={onSubmit}
          className="w-full flex flex-col items-end gap-4"
        >
          <div className="flex w-full gap-8">
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-lg font-semibold">Address</span>
              <RHFTextField fullWidth name="address.country" label="Country" />
              <div className="flex gap-4">
                <RHFTextField fullWidth name="address.city" label="City" />
                <RHFTextField
                  numeric
                  decimalPlaces={0}
                  className="w-16"
                  name="address.zip"
                  label="Zip code"
                />
              </div>
              <RHFTextField fullWidth name="address.street" label="Street" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-lg font-semibold">Card</span>
              <div className="flex gap-4">
                <RHFTextField fullWidth name="card.owner" label="Owner" />
                <RHFTextField fullWidth name="card.cvv" label="CVV" />
              </div>
              <RHFTextField fullWidth name="card.number" label="Card Number" />
              <div className="flex gap-4">
                <RHFTextField fullWidth name="card.exp.month" label="Month" />
                <RHFTextField fullWidth name="card.exp.year" label="Year" />
              </div>
            </div>
          </div>
          <div className="w-full">
            <span className="text-lg font-semibold">Delivery</span>
            <RHFTextField fullWidth name="delivery" label="Delivery person" />
          </div>
          <Button className="ml-auto" type="submit">
            Order
          </Button>
        </FormProvider>
      </Card>
    </div>
  )
}
