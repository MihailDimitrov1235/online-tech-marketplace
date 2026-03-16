import { NavLink } from "react-router";

import { paths } from "@/router";

export const Logo = () => {
  return (
    <NavLink to={paths.home}>
      <div className="relative z-10 text-white text-xl font-semibold tracking-tight">
        TechMarket
      </div>
    </NavLink>
  );
}