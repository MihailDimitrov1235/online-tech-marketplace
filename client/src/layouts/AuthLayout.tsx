import { Outlet } from "react-router";
import { Logo } from "../components/common/Logo";
import { useTheme } from "@/theme/useTheme";

const lightBg = `
  radial-gradient(ellipse 60% 60% at 0% 0%, rgba(167,139,250,0.35) 0%, transparent 60%),
  radial-gradient(ellipse 50% 50% at 100% 100%, rgba(236,72,153,0.25) 0%, transparent 60%),
  radial-gradient(ellipse 40% 40% at 100% 0%, rgba(99,179,237,0.2) 0%, transparent 50%),
  radial-gradient(ellipse 30% 40% at 40% 50%, rgba(139,92,246,0.25) 0%, transparent 60%),
  radial-gradient(ellipse 30% 40% at 60% 55%, rgba(236,72,153,0.2) 0%, transparent 60%),
  radial-gradient(ellipse 25% 30% at 52% 45%, rgba(59,130,246,0.2) 0%, transparent 55%),
  #ffffff
`;

const darkBg = `
  radial-gradient(ellipse 60% 60% at 0% 0%, rgba(139,92,246,0.25) 0%, transparent 60%),
  radial-gradient(ellipse 50% 50% at 100% 100%, rgba(219,39,119,0.2) 0%, transparent 60%),
  radial-gradient(ellipse 40% 40% at 100% 0%, rgba(59,130,246,0.15) 0%, transparent 50%),
  radial-gradient(ellipse 30% 40% at 40% 50%, rgba(109,40,217,0.2) 0%, transparent 60%),
  radial-gradient(ellipse 30% 40% at 60% 55%, rgba(219,39,119,0.15) 0%, transparent 60%),
  radial-gradient(ellipse 25% 30% at 52% 45%, rgba(37,99,235,0.15) 0%, transparent 55%),
  #09090b
`;

export default function AuthLayout() {
  const { theme } = useTheme();

  return (
    <div
      className="relative flex flex-col w-full min-h-screen"
      style={{ background: theme === "dark" ? darkBg : lightBg }}
    >
      <div className="flex items-center px-10 py-7">
        <Logo />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <Outlet />
      </div>

      <p className="text-center text-zinc-400 text-xs pb-6">
        &copy; {new Date().getFullYear()} TechMarket. All rights reserved.
      </p>
    </div>
  );
}
