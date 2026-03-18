import { NavLink } from "react-router"
import { Button } from "../common"

export type ListingParams = {
  id: string
  imageUrl: string
  title: string
  quality: string
  price: number
}

export default function listing({
  id,
  imageUrl,
  title,
  quality,
  price,
}: ListingParams) {
  const url = `/listings/${id}`

  const handleQualityClick = () => {
    console.log("TODO: add quality filter on click")
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      <NavLink to={url}>
        <img src={imageUrl} />
      </NavLink>

      <div className="mt-2 flex justify-between p-4">
        <div className="flex flex-col gap-4">
          <NavLink
            to={url}
            className="text-sm text-contrast hover:text-primary"
          >
            {title}
          </NavLink>
          <Button onClick={handleQualityClick} size={"xs"} className=" w-fit">
            {quality}
          </Button>
          <p className="text-md font-medium text-contrast">{price}€</p>
        </div>
      </div>
    </div>
  )
}
