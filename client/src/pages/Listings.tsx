import { Card } from "@/components/common"
import type { ListingParams } from "@/components/listings/Listing"
import Listing from "@/components/listings/Listing"

const mockupData: ListingParams[] = [
  {
    id: "1",
    imageUrl:
      "https://www.mobileana.com/wp-content/uploads/2025/06/Apple-iPhone-17-Pro-Max-Cosmic-Orange.webp",
    title: "Смартфон Apple iPhone 17e, 256 GB, 5G, Black",
    quality: "new",
    price: 32.32,
  },
  {
    id: "1",
    imageUrl:
      "https://www.mobileana.com/wp-content/uploads/2025/06/Apple-iPhone-17-Pro-Max-Cosmic-Orange.webp",
    title: "Iphone 17",
    quality: "new",
    price: 32.32,
  },
  {
    id: "1",
    imageUrl:
      "https://www.mobileana.com/wp-content/uploads/2025/06/Apple-iPhone-17-Pro-Max-Cosmic-Orange.webp",
    title: "Iphone 17",
    quality: "new",
    price: 32.32,
  },
  {
    id: "1",
    imageUrl:
      "https://www.mobileana.com/wp-content/uploads/2025/06/Apple-iPhone-17-Pro-Max-Cosmic-Orange.webp",
    title: "Iphone 17",
    quality: "new",
    price: 32.32,
  },
  {
    id: "1",
    imageUrl:
      "https://www.mobileana.com/wp-content/uploads/2025/06/Apple-iPhone-17-Pro-Max-Cosmic-Orange.webp",
    title: "Iphone 17",
    quality: "new",
    price: 32.32,
  },
  {
    id: "1",
    imageUrl:
      "https://www.mobileana.com/wp-content/uploads/2025/06/Apple-iPhone-17-Pro-Max-Cosmic-Orange.webp",
    title: "Iphone 17",
    quality: "new",
    price: 32.32,
  },
  {
    id: "1",
    imageUrl:
      "https://www.mobileana.com/wp-content/uploads/2025/06/Apple-iPhone-17-Pro-Max-Cosmic-Orange.webp",
    title: "Iphone 17",
    quality: "new",
    price: 32.32,
  },
  {
    id: "1",
    imageUrl:
      "https://www.mobileana.com/wp-content/uploads/2025/06/Apple-iPhone-17-Pro-Max-Cosmic-Orange.webp",
    title: "Iphone 17",
    quality: "new",
    price: 32.32,
  },
]

export default function Listings() {
  return (
    <div className="flex flex-col w-full gap-8">
      <Card className="w-full">info</Card>
      <div className="flex gap-8 w-full">
        <Card>
          <div className="text-lg mx-auto">Filters</div>
        </Card>
        <div className="flex-1 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-8">
          {mockupData.map(el => (
            <Listing {...el} />
          ))}
        </div>
      </div>
    </div>
  )
}
