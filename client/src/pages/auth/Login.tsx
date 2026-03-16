import { NavLink } from "react-router";
import { useForm } from "react-hook-form";

import { paths } from "@/router";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { FormProvider, RHFTextField } from "@/components/form";

type LoginForm = { username: string; password: string };

export default function Login() {
  const defaultValues = {
    username: '',
    password: ''
  };

  const methods = useForm<LoginForm>({
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
        <div className="text-2xl text-center">Login</div>

        <div className="flex flex-col gap-2 w-full">
          <RHFTextField
            name="username"
            label="Username"
            fullWidth
          />
          <RHFTextField
            name="password"
            label="Password"
            fullWidth
            type="password"
          />
        </div>

        <div className="text-end">
          <span>Don't have an account?</span>
          <NavLink className="text-primary hover:underline ml-1" to={paths.auth.register}>Sign up</NavLink>
        </div>

        <Button className="ml-auto" type="submit">Submit</Button>
      </Card>
    </FormProvider>
  )
}
