import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormProvider, RHFTextField } from "@/components/form"
import { useAppSelector } from "@/store/hooks"
import { Button } from "../common"
import { useEffect } from "react"

const schema = yup.object({
  username: yup
    .string()
    .min(3, "At least 3 characters")
    .required("Username is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
})

type infoForm = {
  username: string
  firstName: string
  lastName: string
}

export default function ChangeInfo() {
  const { user } = useAppSelector(state => state.auth)

  const defaultValues = {
    username: user?.username ?? "",
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
  }

  const methods = useForm<infoForm>({
    defaultValues,
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (user) {
      methods.reset({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      })
    }
  }, [user])

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
          <RHFTextField name="username" label="Username" fullWidth />
          <RHFTextField name="firstName" label="First Name" fullWidth />
          <RHFTextField name="lastName" label="Last Name" fullWidth />
        </div>
        <Button className="w-fit ml-auto h-fit" type="submit">
          Submit
        </Button>
      </div>
    </FormProvider>
  )
}
