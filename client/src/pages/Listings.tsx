import api from "@/api/axiosInstance"
import { Card } from "@/components/common"
import type { ListingParams } from "@/components/listings/Listing"
import Listing from "@/components/listings/Listing"
import { useState, useEffect } from "react"

export default function Listings() {
  const [products, setProducts] = useState<ListingParams[]>([])
  useEffect(() => {
    api
      .get<{
        products: ListingParams[]
      }>("/products")
      .then(res => {
        setProducts(res.data.products)
        console.log(res.data.products)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }, [])

  return (
    <div className="flex flex-col w-full gap-8">
      <Card className="w-full">info</Card>
      <div className="flex gap-8 w-full">
        <Card>
          <div className="text-lg mx-auto">Filters</div>
        </Card>
        <div className="flex-1 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-8">
          {products.map(el => (
            <Listing key={el._id} {...el} />
          ))}
        </div>
      </div>
    </div>
  )
}
