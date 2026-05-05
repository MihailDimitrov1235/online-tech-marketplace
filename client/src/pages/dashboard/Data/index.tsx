import { Card } from "@/components/common"
import { Dropdown } from "@/components/common/Dropdown"
import { paths } from "@/router"
import { useNavigate, Outlet, useLocation } from "react-router"

const dataTypes = [
  { value: "users", label: "Users" },
  { value: "listings", label: "Listings" },
  //   { value: "orders", label: "Orders" },
]

export default function Data() {
  const navigate = useNavigate()
  const location = useLocation()
  const segments = location.pathname.split("/")
  const dataType = segments[segments.indexOf("data") + 1]

  return (
    <div className="w-full flex flex-col gap-6 px-14 py-8 text-contrast">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-contrast/50 uppercase tracking-widest mb-1">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold">Data</h1>
        </div>
        <Dropdown
          label="Data type"
          value={dataType}
          options={dataTypes}
          onChange={val => {
            void navigate(paths.dashboard.data.dataType(val as string))
          }}
          className="w-48"
        />
      </div>

      {!dataType ? (
        <Card className="flex-col items-center justify-center py-24 gap-2 text-center">
          <p className="text-contrast/50 text-sm">
            Select a data type to get started
          </p>
        </Card>
      ) : (
        <Outlet />
      )}
    </div>
  )
}
