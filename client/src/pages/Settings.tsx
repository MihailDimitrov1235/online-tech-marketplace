import { Button, Card } from "@/components/common"
import { useState } from "react"
import ChangeInfo from "@/components/settings/ChangeInfo"
import ChangePassword from "@/components/settings/ChangePassword"

const tabs = ["Change info", "Change Password"]

export default function Settings() {
  const [tab, setTab] = useState(tabs[0])

  return (
    <div className="flex gap-8 w-full">
      <Card className="flex flex-col h-fit min-h-120 gap-4">
        {tabs.map((t, idx) => (
          <Button
            key={idx}
            onClick={() => {
              setTab(t)
            }}
            variant={t == tab ? "primary" : "ghost"}
            className="h-fit"
          >
            {t}
          </Button>
        ))}
      </Card>
      <Card className="flex-1 h-fit">
        {tab == tabs[0] && <ChangeInfo />}
        {tab == tabs[1] && <ChangePassword />}
      </Card>
    </div>
  )
}
