import { NavLink } from "react-router";

import { paths } from '@/router';

import { Button } from "@/components/Button";

export default function Page404() {
  return (
    <div className="text-center flex h-full mt-64 flex-col">
      <p className="text-2xl font-semibold text-primary">404</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-contrast sm:text-7xl">Page not found</h1>
      <p className="mt-6 text-lg font-medium text-pretty text-contrast sm:text-xl/8">Sorry, we couldn’t find the page you’re looking for.</p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <NavLink to={paths.home}><Button>Go back to home</Button></NavLink>
      </div>
    </div>
  )
}
