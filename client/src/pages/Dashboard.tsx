import { Button } from "@/components/common"
import { useState } from "react"

const tabs = [
  {
    label: "Orders (Buyer)",
  },
  {
    label: "Listings (Seller)",
  },
  {
    label: "Deliveries (Delivery)",
  },
  {
    label: "Analytics (Admin)",
  },
]

export default function Dashboard() {
  const [tab, setTab] = useState(tabs[0].label)
  return (
    <div className="w-full flex ">
      <div className="mx-auto h-fit shadow-md rounded-xl overflow-hidden">
        {tabs.map((t, idx) => (
          <Button
            variant={tab == t.label ? "primary" : "ghost"}
            onClick={() => {
              setTab(t.label)
            }}
            className={
              idx == 0
                ? "rounded-r-none"
                : idx == tabs.length - 1
                  ? "rounded-l-none"
                  : "rounded-none"
            }
          >
            {t.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
