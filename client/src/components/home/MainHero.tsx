import { NavLink } from "react-router"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "../common/Button"
import { paths } from "@/router"

const stats = [
  { label: "Products listed", value: "12,000+" },
  { label: "Active sellers", value: "800+" },
  { label: "Happy buyers", value: "3,400+" },
]

export default function MainHero() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-56px)] overflow-hidden px-6 bg-background">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-125 h-125 rounded-full bg-violet-300/30 dark:bg-violet-700/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-100 h-100 rounded-full bg-pink-300/25 dark:bg-pink-700/15 blur-3xl" />
        <div className="absolute top-[30%] right-[15%] w-75 h-75 rounded-full bg-blue-300/20 dark:bg-blue-700/15 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl gap-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-tint border border-primary-tint-border text-primary-on text-sm font-medium">
          <Sparkles size={13} />
          The smarter way to buy and sell tech
        </div>

        {/* Headline */}
        <h1 className="text-6xl sm:text-7xl font-semibold tracking-tight text-balance text-zinc-900 dark:text-white leading-[1.08]">
          Premium tech,{" "}
          <span className="bg-linear-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
            bought and sold
          </span>{" "}
          effortlessly.
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-muted text-pretty max-w-xl leading-relaxed">
          Browse thousands of curated tech products from trusted sellers. Fast
          delivery, verified listings, and a seamless experience from search to
          doorstep.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3 mt-2">
          <NavLink to={paths.listings.root}>
            <Button size="lg">
              Browse listings
              <ArrowRight size={15} className="ml-2" />
            </Button>
          </NavLink>
          <NavLink to={paths.auth.register}>
            <Button size="lg" variant="secondary">
              Start selling
            </Button>
          </NavLink>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-6 pt-6 border-t border-border/60 w-full justify-center">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <span className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {value}
              </span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
