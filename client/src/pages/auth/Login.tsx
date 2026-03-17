import { NavLink, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { paths } from "@/router";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { FormProvider, RHFTextField } from "@/components/form";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/store/authSlice";

type LoginForm = { username: string; password: string };

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate()

  const defaultValues = {
    username: '',
    password: ''
  };

  const methods = useForm<LoginForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit
  } = methods;

  const dispatch = useAppDispatch();
  const onSubmit = handleSubmit(async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      // console.log(result.payload.token)
      await navigate("/")
    }else{
      console.log(result)
    }
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
