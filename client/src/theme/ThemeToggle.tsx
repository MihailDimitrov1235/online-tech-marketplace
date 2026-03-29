import { Moon, Sun } from "lucide-react"
import { useTheme } from "./useTheme"

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 cursor-pointer group"
    >
      <Sun
        size={16}
        className={isDark ? "text-zinc-400" : "text-amber-500"}
      />

      <div className="relative w-8 h-4.5 rounded-full bg-zinc-200 dark:bg-zinc-500/60 border border-transparent dark:border-zinc-400/30 transition-colors duration-300">
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full shadow-sm transition-all duration-300
            ${isDark
              ? "translate-x-3.5 bg-primary-on"
              : "translate-x-0.5 bg-white"
            }
          `}
        />
      </div>

      <Moon
        size={16}
        className={isDark ? "text-primary-on" : "text-zinc-400"}
      />
    </button>
  )
}
