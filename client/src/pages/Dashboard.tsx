import { Button } from "@/components/common"
import { useState } from "react"
import MyListings from "../components/dashboard/MyListings"

const tabs = [
  "Orders (Buyer)",
  "Listings (Seller)",
  "Deliveries (Delivery)",
  "Analytics (Admin)",
]

export default function Dashboard() {
  const [tab, setTab] = useState(tabs[0])
  return (
    <div className="w-full flex flex-col gap-8 px-14 py-8">
      <div className="mx-auto h-fit shadow-md rounded-xl overflow-hidden">
        {tabs.map((t, idx) => (
          <Button
            variant={tab == t ? "primary" : "ghost"}
            onClick={() => {
              setTab(t)
            }}
            className={
              idx == 0
                ? "rounded-r-none"
                : idx == tabs.length - 1
                  ? "rounded-l-none"
                  : "rounded-none"
            }
          >
            {t}
          </Button>
        ))}
      </div>
      <div>
        {tab == tabs[0] && <div>Orders</div>}
        {tab == tabs[1] && <MyListings />}
      </div>
    </div>
  )
}
