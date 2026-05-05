import { Card } from "../common"

export const StatCard = ({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
}) => (
  <Card className="flex-col gap-2 flex-1 min-w-0">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-widest text-contrast/40">
        {label}
      </span>
      <span className="text-contrast/30">{icon}</span>
    </div>
    <span className="text-3xl font-bold text-contrast">{value}</span>
    {sub && <span className="text-xs text-contrast/40">{sub}</span>}
  </Card>
)
