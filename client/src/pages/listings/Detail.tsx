import api from "@/api/axiosInstance"
import { Button, Card } from "@/components/common"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import {
  ArrowBigLeft,
  ArrowBigRight,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import { SpecRenderer } from "@/components/listings/SpecRenderer"
import type { detailedProduct, reviewValue } from "@/types/product"
import RatingVisualizer from "@/components/listings/RatingVisualizer"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FormProvider, RHFTextField } from "@/components/form"
import type { ReviewForm } from "@/components/listings/ReviewRenderer"
import ReviewRenderer, { schema } from "@/components/listings/ReviewRenderer"
import type { pagination } from "@/types/pagination"

export default function Detail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<detailedProduct>()
  const [reviews, setReviews] = useState<reviewValue[]>([])
  const [rating, setRating] = useState<number>(0)
  const [pagination, setPagination] = useState<pagination>({
    total: 0,
    page: 0,
    pages: 0,
  })
  const [imageIdx, setImageIdx] = useState<number>(0)
  useEffect(() => {
    if (!id) {
      return
    }
    api
      .get<{
        product: detailedProduct
        reviews: reviewValue[]
        pagination: pagination
        rating: number
      }>(`/products/${id}`)
      .then(res => {
        setProduct(res.data.product)
        setReviews(res.data.reviews)
        setRating(res.data.rating)
        setPagination(res.data.pagination)
        console.log(res.data)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }, [id])

  const defaultValues = {
    rating: undefined,
    comment: "",
  }

  const methods = useForm<ReviewForm>({
    defaultValues,
    resolver: yupResolver(schema),
  })

  const { handleSubmit, watch, reset } = methods

  const newComment = watch("comment")
  const newRating = watch("rating")

  const onSubmit = handleSubmit(data => {
    api
      .post<{ review: reviewValue }>(`/reviews`, {
        product: id,
        ...data,
      })
      .then(res => {
        setReviews(p => [res.data.review, ...p])
        reset()
        console.log(res.data)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
    // TODO: update rating and pagination (probably make a new request)
  })

  const handleAddToCart = () => {
    api
      .post("/cart", { productId: id })
      .then(res => {
        console.log(res.data)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  return (
    <div className="w-full flex flex-col gap-8 px-14 py-8">
      <button
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-contrast cursor-pointer w-fit"
      >
        <ArrowLeft size={15} />
        Back
      </button>

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
                <RatingVisualizer rating={rating} />
              </div>
              <button
                onClick={() => {
                  console.log("TODO: move to reviews section")
                }}
                className="text-primary cursor-pointer w-fit"
              >{`See all ${pagination.total.toString()} reviews`}</button>
            </div>
            <Button onClick={handleAddToCart} className="text-xl">
              Add to cart
            </Button>
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
        <Card className="flex-1 flex-col gap-6">
          <h1 className="text-2xl font-bold text-contrast">Reviews</h1>
          <FormProvider
            methods={methods}
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <RHFTextField
                placeholder="Write a review..."
                fullWidth
                name={"comment"}
              />
              <RHFTextField
                numeric
                placeholder="Leave a rating..."
                name={"rating"}
                trailingIcon={<span>/5</span>}
              />
            </div>
            {(newComment || newRating) && (
              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => {
                    reset()
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit">Publish</Button>
              </div>
            )}
          </FormProvider>
          <div className="flex flex-col gap-8">
            {reviews.map(r => (
              <ReviewRenderer
                key={r._id}
                review={r}
                setReviews={setReviews}
                productId={id ?? ""}
              />
            ))}
            {/* TODO: add pagination */}
          </div>
        </Card>
      </div>
    </div>
  )
}
