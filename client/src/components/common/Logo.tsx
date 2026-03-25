import { NavLink } from "react-router";

import { paths } from "@/router";

export const Logo = () => {
  return (
    <NavLink to={paths.home}>
      <div className="text-xl font-semibold tracking-tight bg-linear-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
        TechMarket
      </div>
    </NavLink>
  );
}