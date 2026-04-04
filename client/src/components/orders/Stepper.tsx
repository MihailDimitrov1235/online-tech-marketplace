import type { status } from "@/types/order"
import { Package, File, Truck, PackageCheck, Check } from "lucide-react"
import { twMerge } from "tailwind-merge"

const steps = [
  {
    step: "pending",
    label: "Confirmed",
    text: "Order placed and confirmed",
    icon: <File />,
  },
  {
    step: "confirmed",
    label: "Processing",
    text: "Preparing your items",
    icon: <Package />,
  },
  {
    step: "shipped",
    label: "Shipped",
    text: "Order on the way",
    icon: <Truck />,
  },
  {
    step: "delivered",
    label: "Delivered",
    text: "Order received",
    icon: <PackageCheck />,
  },
]

export default function Stepper({ status = "pending" }: { status?: status }) {
  const stepOrder = ["pending", "confirmed", "shipped", "delivered"]
  const currentStepIndex = stepOrder.indexOf(status)
  return (
    <ol className="flex items-center w-full mb-4">
      {steps.map(({ step, label, text, icon }, i) => {
        const isCompleted = i <= currentStepIndex
        const isLast = i === steps.length - 1

        return (
          <li
            key={step}
            className={twMerge(
              "flex items-center",
              !isLast &&
                "flex-1 after:block after:h-0.5 after:bg-border after:flex-1 after:mx-2",
            )}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full 
                    ${isCompleted ? "bg-primary text-primary-contrast shadow-md shadow-primary/30" : "border-2 border-border"} `}
              >
                {isCompleted ? <Check /> : icon}
              </span>
              <span className="flex flex-col items-center text-center">
                <h3
                  className={twMerge(
                    "text-sm font-semibold leading-tight",
                    isCompleted ? "text-primary" : "text-contrast",
                  )}
                >
                  {label}
                </h3>
                <p
                  className={twMerge(
                    "text-xs mt-0.5",
                    isCompleted ? "text-contrast/90" : "text-contrast/60",
                  )}
                >
                  {text}
                </p>
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
