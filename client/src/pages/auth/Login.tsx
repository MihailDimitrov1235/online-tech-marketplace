import { NavLink, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { paths } from "@/router";

import { Button } from "@/components/common/Button";
import { FormProvider, RHFTextField } from "@/components/form";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/store/authSlice";

type LoginForm = { username: string; password: string };

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();

  const location = useLocation();

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
      const returnTo = location.state?.returnTo;

      await navigate(returnTo || paths.home);
    }else{
      console.log(result)
    }
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <FormProvider methods={methods} onSubmit={onSubmit} className="flex flex-1">
      <div className="m-auto w-md flex flex-col gap-8 px-10 py-10 rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-xl shadow-violet-200/50 dark:bg-zinc-900/60 dark:border-white/10 dark:shadow-violet-900/20">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">Welcome back</h1>
          <p className="text-sm text-zinc-400">Sign in to your TechMarket account</p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <RHFTextField name="username" label="Username" fullWidth />
          <RHFTextField name="password" label="Password" fullWidth type="password" />
        </div>

        <Button type="submit" variant="glass" className="w-full" size="lg">Sign in</Button>

        <p className="text-sm text-center text-zinc-400">
          Don't have an account?{" "}
          <NavLink to={paths.auth.register} className="text-primary font-medium hover:underline">
            Create one
          </NavLink>
        </p>
      </div>
    </FormProvider>
  )
}
