import api from "@/api/axiosInstance"
import { Button, Card } from "@/components/common"
import { useState, useEffect } from "react"
import { useParams } from "react-router"
import {
  ArrowBigLeft,
  ArrowBigRight,
  ArrowRight,
  Star,
  StarHalf,
} from "lucide-react"
import { SpecRenderer } from "@/components/listings/SpecRenderer"
import type { detailedProduct } from "@/types/product"

export default function Detail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<detailedProduct>()
  const [imageIdx, setImageIdx] = useState<number>(0)
  const rating = 3.5
  const numberOfReviews = 32
  useEffect(() => {
    if (!id) {
      return
    }
    api
      .get<{
        product: detailedProduct
      }>(`/products/${id}`)
      .then(res => {
        setProduct(res.data.product)
        console.log(res.data.product)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }, [id])
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full flex gap-8">
        <Card className="flex-3 h-150">
          <div className="flex h-full w-full items-center justify-between gap-8">
            <Button
              disabled={imageIdx == 0}
              variant="outline"
              size="icon"
              className="h-10 "
              onClick={() => {
                setImageIdx(imageIdx => imageIdx - 1)
              }}
            >
              <ArrowBigLeft strokeWidth={1} />
            </Button>
            <div className="overflow-hidden h-full">
              <div className="w-fit h-full rounded-lg overflow-hidden">
                <img
                  key={imageIdx}
                  className="object-contain h-full animate-fade"
                  src={product?.images[imageIdx]}
                  alt=""
                />
              </div>
            </div>
            <Button
              disabled={Boolean(
                product?.images.length && imageIdx == product.images.length - 1,
              )}
              variant="outline"
              size="icon"
              className="h-10 "
              onClick={() => {
                setImageIdx(imageIdx => imageIdx + 1)
              }}
            >
              <ArrowBigRight strokeWidth={1} />
            </Button>
          </div>
        </Card>

        <div className="flex flex-2 flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <div className="flex justify-between w-full">
              <h2 className="text-2xl font-bold text-contrast">
                {product?.name}
              </h2>
              <div className="text-xl text-contrast">{product?.price}€</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="bg-primary w-fit h-fit rounded-full text-primary-contrast px-1 uppercase text-xs ">
                {product?.condition}
              </div>
              <div className="text-contrast">Stock: {product?.stock}</div>
            </div>

            <div>
              <div className="flex items-center">
                <span className="text-contrast">{rating}</span>
                {Array.from({ length: 5 }, (_, idx) => (
                  <div className="relative flex justify-center items-center">
                    {rating >= idx + 1 ? (
                      <Star
                        size={16}
                        className="absolute z-10"
                        fill="#e5e85f"
                        strokeWidth={0}
                      />
                    ) : (
                      rating >= idx + 0.5 && (
                        <StarHalf
                          size={16}
                          className="absolute z-10"
                          fill="#e5e85f"
                          strokeWidth={0}
                        />
                      )
                    )}

                    <Star
                      size={16}
                      className="relative z-0"
                      fill="#dbdbdb"
                      strokeWidth={0}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  console.log("TODO: move to reviews section")
                }}
                className="text-primary cursor-pointer w-fit"
              >{`See all ${numberOfReviews.toString()} reviews`}</button>
            </div>
            <Button className="text-xl">Add to cart</Button>
          </Card>
          <Card className="flex flex-col gap-4 text-contrast">
            <h2>Seller</h2>

            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-tint text-primary-on border-primary-tint-border hover:bg-primary-tint-hover text-2xl font-bold uppercase flex justify-center items-center select-none">
                {product?.seller.firstName[0]}
                {product?.seller.lastName[0]}
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {product?.seller.firstName} {product?.seller.lastName}
                </div>
                <div>Address</div>
              </div>
            </div>

            <Button
              className="flex gap-1 items-center justify-center w-fit mx-auto"
              variant="ghost"
            >
              {"See profile"}
              <ArrowRight className="mt-1" size={14} />
            </Button>
          </Card>
        </div>
      </div>
      <div className="w-full flex gap-4">
        <Card className="flex-col gap-4 flex-1 ">
          <h1 className="text-2xl font-bold text-contrast">Specifications</h1>
          {product && SpecRenderer(product.specs)}
        </Card>
        <Card className="flex-1">
          <h1 className="text-2xl font-bold text-contrast">Reviews</h1>
        </Card>
      </div>
    </div>
  )
}
