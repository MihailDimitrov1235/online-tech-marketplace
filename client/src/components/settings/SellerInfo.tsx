import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormProvider } from "@/components/form"
import { Button } from "../common"
import { RHFCheckbox } from "../form/RHFCheckbox"
import { RHFRadio } from "../form/RHFRadio"

const schema = yup.object({
  test: yup.boolean().default(false),
  duration: yup
    .number()
    .transform((val: number) => (isNaN(val) ? undefined : val))
    .required("Select a duration"),
})

type SellerForm = {
  test: boolean
  duration: number
}

export default function SellerInfo() {
  const defaultValues = {
    test: false,
    duration: undefined,
  }

  const methods = useForm<SellerForm>({
    defaultValues,
    resolver: yupResolver(schema),
  })

  const { handleSubmit } = methods

  const onSubmit = handleSubmit(data => {
    console.log(data)
  })
  return (
    <div>
      <FormProvider
        methods={methods}
        onSubmit={onSubmit}
        className="flex flex-1 w-full"
      >
        <div className="flex flex-col min-h-108 w-full h-fit justify-between">
          <div className="flex flex-col gap-2">
            <RHFCheckbox name="test" label="Test checkbox" />
            <RHFRadio name="duration" value="24" label="24 months" />
            <RHFRadio name="duration" value="32" label="32 months" />
            <RHFRadio name="duration" value="60" label="60 months" />
          </div>
          <Button className="w-fit ml-auto h-fit" type="submit">
            Submit
          </Button>
        </div>
      </FormProvider>
    </div>
  )
}
