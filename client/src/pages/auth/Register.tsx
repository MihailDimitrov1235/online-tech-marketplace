import { NavLink } from "react-router";
import { useForm } from "react-hook-form";

import { paths } from "@/router";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { FormProvider, RHFTextField } from "@/components/form";

type RegisterForm = { username: string; firstName: string; lastName: string; password: string; confirmPassword: string };

export default function Register() {
  const defaultValues = {
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  };

  const methods = useForm<RegisterForm>({
    defaultValues
  });

  const {
    handleSubmit
  } = methods;

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });


  return (
    <FormProvider methods={methods} onSubmit={onSubmit} className="flex flex-1">
      <Card size="lg" className="flex flex-col gap-6 m-auto px-6 w-125">
        <div className="text-2xl text-center">Register</div>

        <div className="flex flex-col gap-2 w-full">
          <RHFTextField
            name="username"
            label="Username"
            fullWidth
          />

          <div className="grid grid-cols-2 gap-4">
            <RHFTextField
              name="firstName"
              label="First name"
              fullWidth
            />

            <RHFTextField
              name="lastName"
              label="Last name"
              fullWidth
            />
          </div>

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
        </div>

        <div className="text-end">
          <span>Already have an account?</span>
          <NavLink className="text-primary hover:underline ml-1" to={paths.auth.login}>Sign in</NavLink>
        </div>

        <Button className="ml-auto" type="submit">Submit</Button>
      </Card>
    </FormProvider>
  )
}
