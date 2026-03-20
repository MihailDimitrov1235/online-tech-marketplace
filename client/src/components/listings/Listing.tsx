import { NavLink } from "react-router"
import { Button } from "../common"

export type ListingParams = {
  _id: string
  images: string[]
  name: string
  condition: string
  price: number
}

export default function listing({
  _id,
  images,
  name,
  condition,
  price,
}: ListingParams) {
  const url = `/listings/${_id}`

  const handleQualityClick = () => {
    console.log("TODO: add quality filter on click")
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-md flex flex-col">
      <NavLink to={url}>
        <img src={images[0]} />
      </NavLink>

      <div className="mt-2 flex justify-between p-4 flex-1">
        <div className="flex flex-col gap-4 h-full justify-between">
          <NavLink
            to={url}
            className="text-sm text-contrast hover:text-primary"
          >
            {name}
          </NavLink>
          <Button onClick={handleQualityClick} size={"xs"} className=" w-fit">
            {condition}
          </Button>
          <p className="text-md font-medium text-contrast">{price}€</p>
        </div>
      </div>
    </div>
  )
}
