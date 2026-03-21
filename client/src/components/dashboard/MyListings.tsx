import { Pencil, Plus, X } from "lucide-react"
import { Button } from "../common"
import { Card } from "../common/Card"
import { useEffect, useState } from "react"
import api from "@/api/axiosInstance"
import type { ListingParams } from "../listings/Listing"
import { useAppSelector } from "@/store/hooks"
import { NavLink } from "react-router"
import { paths } from "@/router"

export default function MyListings() {
  const { user } = useAppSelector(state => state.auth)
  const [products, setProducts] = useState<ListingParams[]>([])
  useEffect(() => {
    api
      .get<{
        products: ListingParams[]
      }>("/products", {
        params: {
          seller: user?._id,
        },
      })
      .then(res => {
        setProducts(res.data.products)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }, [user])
  return (
    <div className="flex flex-col w-full gap-8">
      <Card className="justify-between items-center">
        <div className="text-xl font-semibold">My listings</div>
        <NavLink to={`${paths.listings}/new`}>
          <Button className="gap-2 items-center">
            <div>Add new</div>
            <Plus className="mt-1" size={18} />
          </Button>
        </NavLink>
      </Card>
      <Card className="flex flex-col w-full gap-4">
        {products.map((prod, idx) => (
          <div
            key={idx}
            className={`flex justify-between ${idx != products.length - 1 ? "border-b-2 border-neutral/30 pb-2" : ""} `}
          >
            <div className="flex gap-4">
              <NavLink to={`${paths.listings}/${prod._id}`}>
                <img className="h-24 w-24 object-cover" src={prod.images[0]} />
              </NavLink>
              <NavLink
                to={`${paths.listings}/${prod._id}`}
                className="hover:text-primary cursor-pointer"
              >
                {prod.name}
              </NavLink>
            </div>
            <div className="flex gap-2">
              <NavLink to={`${paths.listings}/edit/${prod._id}`}>
                <Button className="bg-blue-400" size="icon">
                  <Pencil size={12} />
                </Button>
              </NavLink>
              <Button className="bg-error h-fit" size="icon">
                <X size={12} />
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
