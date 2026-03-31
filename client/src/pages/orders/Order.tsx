import { Check, Package, Truck } from "lucide-react"
import { twMerge } from "tailwind-merge"

const elementStyles =
  "after:content-[''] after:w-16 after:h-1 after:border-b after:border-brand-subtle after:border-4 after:inline-block after:ms-4 after:rounded-full"
const activeStyles =
  "flex items-center justify-center w-10 h-10 bg-primary text-primary-contrast m-4 rounded-full"
const inactiveStyles =
  "flex items-center justify-center w-10 h-10 bg-neutral m-4 rounded-full border border-border"
const iconStyles =
  "flex items-center justify-center w-10 h-10 bg-brand-softer rounded-full "

export default function Order() {
  return (
    <div className="text-contrast">
      Order
      <ol className="items-center w-full flex">
        <li className={twMerge("flex items-center", elementStyles)}>
          <span className={twMerge(iconStyles, activeStyles)}>
            <Check />
          </span>
          <span>
            <h3 className="font-medium leading-tight">User info</h3>
            <p className="text-sm">Step details here</p>
          </span>
        </li>
        <li className={twMerge("flex items-center", elementStyles)}>
          <span className={twMerge(iconStyles, inactiveStyles)}>
            <Truck />
          </span>
          <span>
            <h3 className="font-medium leading-tight">Company info</h3>
            <p className="text-sm">Step details here</p>
          </span>
        </li>
        <li className={twMerge("flex items-center")}>
          <span className={twMerge(iconStyles, inactiveStyles)}>
            <Package />
          </span>
          <span>
            <h3 className="font-medium leading-tight">Payment info</h3>
            <p className="text-sm">Step details here</p>
          </span>
        </li>
      </ol>
    </div>
  )
}
