import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  ArrowBigLeft,
  ArrowBigRight,
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Star,
} from "lucide-react"

import api from "@/api/axiosInstance"
import { useAppDispatch } from "@/store/hooks"
import { setItems, openCart } from "@/store/cartSlice"
import type { CartItem } from "@/store/cartSlice"
import { Button, Card } from "@/components/common"
import { FormProvider, RHFTextField } from "@/components/form"
import { SpecRenderer } from "@/components/listings/SpecRenderer"
import RatingVisualizer from "@/components/listings/RatingVisualizer"
import ReviewRenderer, { schema } from "@/components/listings/ReviewRenderer"
import type { ReviewForm } from "@/components/listings/ReviewRenderer"
import type { detailedProduct, reviewValue } from "@/types/product"
import type { pagination } from "@/types/pagination"

export default function Detail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [product, setProduct] = useState<detailedProduct>()
  const [reviews, setReviews] = useState<reviewValue[]>([])
  const [rating, setRating] = useState(0)
  const [pagination, setPagination] = useState<pagination>({
    total: 0,
    page: 0,
    pages: 0,
  })
  const [imageIdx, setImageIdx] = useState(0)

  useEffect(() => {
    if (!id) return
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
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }, [id])

  const methods = useForm<ReviewForm>({
    defaultValues: { rating: undefined, comment: "" },
    resolver: yupResolver(schema),
  })

  const { handleSubmit, watch, reset } = methods
  const newComment = watch("comment")
  const newRating = watch("rating")

  const onSubmit = handleSubmit(data => {
    api
      .post<{ review: reviewValue }>("/reviews", { product: id, ...data })
      .then(res => {
        setReviews(p => [res.data.review, ...p])
        reset()
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  })

  const handleAddToCart = () => {
    api
      .post<{ cart: { items: CartItem[] } }>("/cart", { productId: id })
      .then(res => {
        dispatch(setItems(res.data.cart.items))
        dispatch(openCart())
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  return (
    <div className="w-full flex flex-col">
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border-b border-border px-14 py-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-40%] right-[-5%] w-72 h-72 rounded-full bg-violet-300/20 dark:bg-violet-600/10 blur-3xl" />
          <div className="absolute bottom-[-40%] left-[10%] w-48 h-48 rounded-full bg-pink-300/15 dark:bg-pink-600/10 blur-3xl" />
        </div>
        <button
          onClick={() => {
            void navigate(-1)
          }}
          className="relative flex items-center gap-1.5 text-sm text-muted hover:text-contrast cursor-pointer w-fit mb-4"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <div className="relative">
          <p className="text-xs font-medium text-primary-on uppercase tracking-widest mb-1">
            Product
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-contrast">
            {product?.name ?? "Loading..."}
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-8 px-14 py-8">
        <div className="w-full flex gap-8">
          <Card className="flex-3 h-150">
            <div className="flex h-full w-full items-center justify-between gap-8">
              <Button
                disabled={imageIdx === 0}
                variant="outline"
                size="icon"
                className="h-10 text-primary-on"
                onClick={() => {
                  setImageIdx(i => i - 1)
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
                    alt={product?.name}
                  />
                </div>
              </div>

              <Button
                disabled={Boolean(
                  product?.images.length &&
                  imageIdx === product.images.length - 1,
                )}
                variant="outline"
                size="icon"
                className="h-10 text-primary-on"
                onClick={() => {
                  setImageIdx(i => i + 1)
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
                <div className="bg-primary w-fit h-fit rounded-full text-primary-contrast px-3 py-0.5 uppercase text-xs">
                  {product?.condition}
                </div>
                <div className="text-contrast">Stock: {product?.stock}</div>
              </div>

              <div className="flex items-center gap-2">
                <RatingVisualizer rating={rating} />
                <span className="text-sm text-muted flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  {rating.toFixed(1)}
                </span>
                <button className="text-xs text-primary cursor-pointer hover:underline">
                  {`(${String(pagination.total)} reviews)`}
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                variant="primary"
                className="w-full gap-2"
              >
                <ShoppingCart size={16} />
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
                See profile
                <ArrowRight className="mt-1" size={14} />
              </Button>
            </Card>
          </div>
        </div>

        <div className="w-full flex gap-4">
          <Card className="flex-col gap-4 flex-1">
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
                  name="comment"
                />
                <RHFTextField
                  numeric
                  placeholder="Leave a rating..."
                  name="rating"
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
              {reviews.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <p className="text-sm font-medium text-contrast">
                    No reviews yet
                  </p>
                  <p className="text-xs text-muted">
                    Be the first to share your experience
                  </p>
                </div>
              ) : (
                reviews.map(r => (
                  <ReviewRenderer
                    key={r._id}
                    review={r}
                    setReviews={setReviews}
                    productId={id ?? ""}
                  />
                ))
              )}
              {/* TODO: add pagination */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
