import type { reviewValue } from "@/types/product"
import RatingVisualizer from "./RatingVisualizer"
import { Button } from "../common"
import { Pencil, Trash } from "lucide-react"
import { useAppSelector } from "@/store/hooks"
import { useState } from "react"
import { FormProvider, RHFTextField } from "../form"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import api from "@/api/axiosInstance"
import * as yup from "yup"

export type ReviewForm = {
  comment: string
  rating: number
}

export const schema = yup.object({
  comment: yup.string().min(3, "At least 3 characters").required("Write a message"),
  rating: yup.number().min(0).max(5).required("Rating is required"),
})

function getRelativeTime(date: string | Date) {
  const diff = (new Date(date).getTime() - Date.now()) / 1000
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ]
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  for (const [unit, seconds] of units) {
    if (Math.abs(diff) >= seconds) return rtf.format(Math.round(diff / seconds), unit)
  }
  return "just now"
}

export default function ReviewRenderer({
  review,
  productId,
  setReviews,
}: {
  review: reviewValue
  productId: string
  setReviews: React.Dispatch<React.SetStateAction<reviewValue[]>>
}) {
  const { user } = useAppSelector(state => state.auth)
  const [editing, setEditing] = useState(false)
  const isOwner = review.author._id === user?._id

  const methods = useForm<ReviewForm>({
    defaultValues: { rating: review.rating, comment: review.comment },
    resolver: yupResolver(schema),
  })

  const { handleSubmit, reset } = methods

  const deleteReview = (_id: string) => {
    api
      .delete(`/reviews/${_id}`)
      .then(() => setReviews(p => p.filter(r => r._id !== _id)))
      .catch((err: unknown) => console.log(err))
  }

  const onSubmit = handleSubmit(data => {
    api
      .patch<{ review: reviewValue }>(`/reviews/${review._id}`, { product: productId, ...data })
      .then(res => {
        setReviews(p => p.map(r => (r._id === review._id ? res.data.review : r)))
        setEditing(false)
      })
      .catch((err: unknown) => console.log(err))
  })

  return (
    <FormProvider methods={methods} onSubmit={onSubmit} className="flex flex-col gap-3 pt-6 border-t border-border first:pt-0 first:border-0">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary-on text-sm font-bold uppercase flex items-center justify-center select-none shrink-0">
          {review.author.firstName[0]}
          {review.author.lastName[0]}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-contrast leading-tight">
            {review.author.firstName} {review.author.lastName}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <RatingVisualizer rating={review.rating} text={false} />
            <span className="text-xs text-muted">{getRelativeTime(review.createdAt)}</span>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setEditing(p => !p)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-primary-tint cursor-pointer transition-colors"
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              onClick={() => deleteReview(review._id)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-error hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors"
            >
              <Trash size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Comment / edit form */}
      {editing ? (
        <div className="flex flex-col gap-3 pl-12">
          <div className="flex gap-3">
            <RHFTextField name="comment" fullWidth placeholder="Edit your review..." />
            <RHFTextField name="rating" numeric placeholder="Rating" trailingIcon={<span>/5</span>} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={() => { reset(); setEditing(false) }} variant="outline" size="sm">Cancel</Button>
            <Button type="submit" size="sm">Save</Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted leading-relaxed pl-12">{review.comment}</p>
      )}
    </FormProvider>
  )
}
