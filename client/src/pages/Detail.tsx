import api from "@/api/axiosInstance"
import { Button, Card } from "@/components/common"
import { useState, useEffect } from "react"
import { useParams } from "react-router"
import { ArrowBigLeft, ArrowBigRight } from "lucide-react"

type SpecValue =
  | string
  | number
  | boolean
  | SpecValue[]
  | { [key: string]: SpecValue }

type detailedInformation = {
  _id: string
  images: string[]
  name: string
  condition: string
  price: number
  specs: Record<string, SpecValue>
}

export default function Detail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<detailedInformation>()
  const [imageIdx, setImageIdx] = useState<number>(0)
  useEffect(() => {
    if (!id) {
      return
    }
    api
      .get<{
        product: detailedInformation
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
            <ArrowBigLeft />
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
            <ArrowBigRight />
          </Button>
        </div>
      </Card>

      <Card className="flex-2">text</Card>
    </div>
  )
}
