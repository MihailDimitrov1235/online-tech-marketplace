import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormProvider, RHFTextField } from "@/components/form"
import { Button } from "../common"

const schema = yup.object({
  newPassword: yup
    .string()
    .min(8, "At least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
})

type PassForm = {
  newPassword: string
  confirmPassword: string
}

export default function ChangePassword() {
  const defaultValues = {
    newPassword: "",
    confirmPassword: "",
  }

  const methods = useForm<PassForm>({
    defaultValues,
    resolver: yupResolver(schema),
  })

  const { handleSubmit } = methods

  const onSubmit = handleSubmit(data => {
    console.log("TODO")
  })
  return (
    <FormProvider
      methods={methods}
      onSubmit={onSubmit}
      className="flex flex-1 w-full"
    >
      <div className="flex flex-col min-h-108 w-full h-fit justify-between">
        <div className="flex flex-col gap-2">
          <RHFTextField name="newPassword" label="New Password" fullWidth />
          <RHFTextField
            name="confirmPassword"
            label="Confirm Password"
            fullWidth
          />
        </div>
        <Button className="w-fit ml-auto h-fit" type="submit">
          Submit
        </Button>
      </div>
    </FormProvider>
  )
}
