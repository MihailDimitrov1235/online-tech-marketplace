import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ArrowBigLeft, ArrowBigRight, ArrowLeft, ArrowRight } from "lucide-react"

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
  const [pagination, setPagination] = useState<pagination>({ total: 0, page: 0, pages: 0 })
  const [imageIdx, setImageIdx] = useState(0)

  useEffect(() => {
    if (!id) return
    api
      .get<{ product: detailedProduct; reviews: reviewValue[]; pagination: pagination; rating: number }>(`/products/${id}`)
      .then(res => {
        setProduct(res.data.product)
        setReviews(res.data.reviews)
        setRating(res.data.rating)
        setPagination(res.data.pagination)
      })
      .catch((err: unknown) => console.log(err))
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
      .catch((err: unknown) => console.log(err))
  })

  const handleAddToCart = () => {
    api
      .post<{ cart: { items: CartItem[] } }>("/cart", { productId: id })
      .then(res => {
        dispatch(setItems(res.data.cart.items))
        dispatch(openCart())
      })
      .catch((err: unknown) => console.log(err))
  }

  return (
    <div className="w-full flex flex-col gap-8 px-14 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-contrast cursor-pointer w-fit"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      {/* Product */}
      <div className="w-full flex gap-8">
        {/* Image carousel */}
        <Card className="flex-3 h-150">
          <div className="flex h-full w-full items-center justify-between gap-8">
            <Button
              disabled={imageIdx === 0}
              variant="outline"
              size="icon"
              className="h-10 text-primary-on"
              onClick={() => setImageIdx(i => i - 1)}
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
              disabled={Boolean(product?.images.length && imageIdx === product.images.length - 1)}
              variant="outline"
              size="icon"
              className="h-10 text-primary-on"
              onClick={() => setImageIdx(i => i + 1)}
            >
              <ArrowBigRight strokeWidth={1} />
            </Button>
          </div>
        </Card>

        {/* Info & seller */}
        <div className="flex flex-2 flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <div className="flex justify-between w-full">
              <h2 className="text-2xl font-bold text-contrast">{product?.name}</h2>
              <div className="text-xl text-contrast">{product?.price}€</div>
            </div>

            <div className="flex justify-between items-center">
              <div className="bg-primary w-fit h-fit rounded-full text-primary-contrast px-1 uppercase text-xs">
                {product?.condition}
              </div>
              <div className="text-contrast">Stock: {product?.stock}</div>
            </div>

            <div>
              <RatingVisualizer rating={rating} />
              <button className="text-primary cursor-pointer w-fit">
                {`See all ${pagination.total} reviews`}
              </button>
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

            <Button className="flex gap-1 items-center justify-center w-fit mx-auto" variant="ghost">
              See profile
              <ArrowRight className="mt-1" size={14} />
            </Button>
          </Card>
        </div>
      </div>

      {/* Specs & reviews */}
      <div className="w-full flex gap-4">
        <Card className="flex-col gap-4 flex-1">
          <h1 className="text-2xl font-bold text-contrast">Specifications</h1>
          {product && SpecRenderer(product.specs)}
        </Card>

        <Card className="flex-1 flex-col gap-6">
          <h1 className="text-2xl font-bold text-contrast">Reviews</h1>

          <FormProvider methods={methods} onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <RHFTextField placeholder="Write a review..." fullWidth name="comment" />
              <RHFTextField numeric placeholder="Leave a rating..." name="rating" trailingIcon={<span>/5</span>} />
            </div>
            {(newComment || newRating) && (
              <div className="flex justify-end gap-4">
                <Button onClick={() => reset()} variant="outline">Cancel</Button>
                <Button type="submit">Publish</Button>
              </div>
            )}
          </FormProvider>

          <div className="flex flex-col gap-8">
            {reviews.map(r => (
              <ReviewRenderer key={r._id} review={r} setReviews={setReviews} productId={id ?? ""} />
            ))}
            {/* TODO: add pagination */}
          </div>
        </Card>
      </div>
    </div>
  )
}
