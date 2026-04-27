import api from "@/api/axiosInstance"
import { Button, Card } from "@/components/common"
import { UserRoles } from "@/types/auth"
import type { User } from "@/types/auth"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"

export default function UserDataDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [user, setUser] = useState<User>()
  const [roles, setRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    api
      .get<{ user: User }>(`/users/${id}`)
      .then(res => {
        setUser(res.data.user)
        setRoles(res.data.user.roles)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }, [id])

  const toggleRole = (role: string) => {
    setRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role],
    )
  }

  const handleSave = () => {
    if (!id) return
    setLoading(true)
    api
      .patch<{ user: User }>(`/users/${id}/roles`, { roles })
      .then(res => {
        setUser(res.data.user)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const hasChanges =
    JSON.stringify(roles.sort()) !==
    JSON.stringify([...(user?.roles ?? [])].sort())

  return (
    <div className="px-14 py-8 flex flex-col gap-6 text-contrast">
      <div className="flex items-center justify-between">
        <div className="flex text-xl gap-2">
          <span className="font-bold uppercase">User</span>
          <span className="uppercase font-semibold text-contrast/50">
            {id?.slice(-8)}
          </span>
        </div>
        <button
          onClick={() => void navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-contrast cursor-pointer"
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </div>

      {user && (
        <div className="flex flex-col gap-4">
          <Card className="flex-col gap-1">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-contrast/50 mb-3">
              Info
            </h2>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-contrast/50">Username</span>
              <span>{user.username}</span>
              <span className="text-contrast/50">First name</span>
              <span>{user.firstName}</span>
              <span className="text-contrast/50">Last name</span>
              <span>{user.lastName}</span>
              <span className="text-contrast/50">ID</span>
              <span className="text-contrast/50">{user._id}</span>
            </div>
          </Card>

          <Card className="flex-col gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-contrast/50">
              Roles
            </h2>
            <div className="flex flex-wrap gap-2">
              {UserRoles.map(role => {
                const active = roles.includes(role)
                return (
                  <Button
                    key={role}
                    variant={active ? "primary" : "outline"}
                    disabled={role == "buyer"}
                    size="xs"
                    onClick={() => {
                      toggleRole(role)
                    }}
                  >
                    {role}
                  </Button>
                )
              })}
            </div>
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!hasChanges || loading || roles.length === 0}
              >
                {loading ? "Saving..." : "Save roles"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
