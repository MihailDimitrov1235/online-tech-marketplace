import { Button, Card } from "@/components/common"
import ChangeInfo from "@/components/settings/ChangeInfo"
import ChangePassword from "@/components/settings/ChangePassword"
import SellerInfo from "@/components/settings/SellerInfo"
import { useSearchParams } from "react-router"

const tabs = [
  { label: "Change Info", value: "info" },
  { label: "Change Password", value: "password" },
  { label: "Seller Info", value: "seller" },
] as const

type TabValue = (typeof tabs)[number]["value"]

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams()
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const tab = (searchParams.get("tab") as TabValue) ?? tabs[0].value

  const setTab = (value: TabValue) => {
    setSearchParams({ tab: value })
  }

  return (
    <div className="flex gap-8 w-full px-14 py-8">
      <Card className="flex flex-col h-fit min-h-120 gap-4">
        {tabs.map(t => (
          <Button
            key={t.value}
            onClick={() => {
              setTab(t.value)
            }}
            variant={t.value === tab ? "primary" : "ghost"}
            className="h-fit"
          >
            {t.label}
          </Button>
        ))}
      </Card>
      <Card className="flex-1 h-fit">
        {tab === "info" && <ChangeInfo />}
        {tab === "password" && <ChangePassword />}
        {tab === "seller" && <SellerInfo />}
      </Card>
    </div>
  )
}
