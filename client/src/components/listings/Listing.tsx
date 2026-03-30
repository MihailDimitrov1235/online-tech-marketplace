import { NavLink } from "react-router"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"
import { paths } from "@/router"
import { Button } from "../common"
import api from "@/api/axiosInstance"

export type ListingParams = {
  _id: string
  images: string[]
  name: string
  condition: string
  price: number
}

export default function Listing({
  _id,
  images,
  name,
  condition,
  price,
}: ListingParams) {
  const url = `${paths.listings}/${_id}`

  const [imgLoaded, setImgLoaded] = useState(false)

  const handleQualityClick = () => {
    console.log("TODO: add quality filter on click")
  }

  const handleAddToCart = () => {
    api
      .post("/cart", { productId: _id })
      .then(res => {
        console.log(res.data)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  return (
    <div className="rounded-2xl flex flex-col bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-lg shadow-zinc-200/50 dark:shadow-surface hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02] overflow-hidden">
      <NavLink
        to={url}
        className="aspect-square bg-zinc-50/80 dark:bg-zinc-800/50 block overflow-hidden relative"
      >
        {!imgLoaded && (
          <div className="absolute inset-0 bg-zinc-200/80 dark:bg-zinc-700/50 animate-pulse" />
        )}
        <img
          className={`object-contain h-full w-full transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          src={images[0]}
          onLoad={() => {
            setImgLoaded(true)
          }}
        />
      </NavLink>

      <div className="flex flex-col gap-2 p-4">
        <NavLink
          to={url}
          className="text-sm font-medium text-contrast hover:text-primary line-clamp-2 leading-snug"
        >
          {name}
        </NavLink>

        <div className="flex items-center justify-between mt-1">
          <span
            className="text-xs px-2 py-0.5 rounded-full bg-primary-tint text-primary-on font-medium cursor-pointer"
            onClick={handleQualityClick}
          >
            {condition}
          </span>
          <p className="text-base font-semibold text-contrast">{price}€</p>
        </div>

        <Button
          onClick={handleAddToCart}
          size="sm"
          variant="primary"
          className="w-full mt-2.5"
        >
          <ShoppingCart size={14} />
          Add to cart
        </Button>
      </div>
    </div>
  )
}
