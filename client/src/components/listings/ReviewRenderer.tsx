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
  comment: yup
    .string()
    .min(3, "At least 3 characters")
    .required("Write a message"),
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
    if (Math.abs(diff) >= seconds) {
      return rtf.format(Math.round(diff / seconds), unit)
    }
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
  const [editing, setEditing] = useState<boolean>(false)

  const defaultValues = {
    rating: review.rating,
    comment: review.comment,
  }

  const methods = useForm<ReviewForm>({
    defaultValues,
    resolver: yupResolver(schema),
  })

  const { handleSubmit, reset } = methods

  function deleteReview(_id: string) {
    api
      .delete(`/reviews/${_id}`)
      .then(res => {
        setReviews(p => p.filter(r => r._id != _id))
        console.log(res.data)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  const onSubmit = handleSubmit(data => {
    api
      .patch<{ review: reviewValue }>(`/reviews/${review._id}`, {
        product: productId,
        ...data,
      })
      .then(res => {
        setReviews(p =>
          p.map(r => (r._id === review._id ? res.data.review : r)),
        )
        setEditing(false)
        console.log(res.data)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  })
  return (
    <FormProvider
      methods={methods}
      onSubmit={onSubmit}
      className="flex flex-col"
    >
      <div className="flex gap-2 items-center">
        <div className="w-10 h-10 rounded-full bg-primary-tint text-primary-on border-primary-tint-border text-md font-bold uppercase flex justify-center items-center select-none">
          {review.author.firstName[0]}
          {review.author.lastName[0]}
        </div>
        {editing ? (
          <RHFTextField
            name="rating"
            size="xs"
            trailingIcon={<span className="text-sm h-fit my-auto">/5</span>}
          />
        ) : (
          <RatingVisualizer rating={review.rating} text={false} />
        )}
        <span className="ml-auto text-contrast">
          {/* {new Date(review.createdAt).toLocaleDateString("en-UK", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })} */}
          {getRelativeTime(review.createdAt)}
        </span>
        {review.author._id == user?._id && (
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="outline"
              className="hover:text-info p-1.5"
              onClick={() => {
                setEditing(p => !p)
              }}
            >
              <Pencil size={16} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="hover:text-error p-1.5"
              onClick={() => {
                deleteReview(review._id)
              }}
            >
              <Trash size={16} />
            </Button>
          </div>
        )}
      </div>
      {editing ? (
        <div className="flex flex-col mt-4 gap-4">
          <RHFTextField name="comment" fullWidth />
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => {
                reset()
                setEditing(false)
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">Edit</Button>
          </div>
        </div>
      ) : (
        <div className="text-contrast">{review.comment}</div>
      )}
    </FormProvider>
  )
}
