import { NavLink } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { paths } from "@/router";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { FormProvider, RHFTextField } from "@/components/form";

type RegisterForm = { username: string; firstName: string; lastName: string; password: string; confirmPassword: string };

const schema = yup.object({
  username: yup.string().min(3, "At least 3 characters").required("Username is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  password: yup.string().min(8, "At least 8 characters").required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export default function Register() {
  const defaultValues = {
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  };

  const methods = useForm<RegisterForm>({
    defaultValues,
    resolver: yupResolver(schema),
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
