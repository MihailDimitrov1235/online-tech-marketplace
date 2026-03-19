import { Outlet } from "react-router";
import { Logo } from "../components/common/Logo";

export default function AuthLayout() {
  return (
    <div className=" flex w-full min-h-screen flex-1">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-contrast p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--color-primary)_0%,#18181b_60%)]" />

        <div className="relative z-10 text-white text-xl font-semibold tracking-tight">
          <Logo />
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Buy & sell tech,<br />without the hassle.
            </h2>
            <p className="text-zinc-400 text-base max-w-sm">
              Thousands of verified listings. Secure payments. Fast delivery. Built for tech lovers.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {([["12k+", "Listings"], ["4.9★", "Avg. rating"], ["Fast", "Shipping"]] as const).map(([val, label]) => (
              <div key={label} className="flex flex-col bg-purple-950/50 border border-purple-800/40 rounded-xl px-4 py-3">
                <span className="text-white font-semibold text-sm">{val}</span>
                <span className="text-zinc-500 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-zinc-500 text-xs">
          &copy; {new Date().getFullYear()} TechMarket. All rights reserved.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex bg-zinc-50">
        <Outlet />
      </div>
    </div>
  );
}
