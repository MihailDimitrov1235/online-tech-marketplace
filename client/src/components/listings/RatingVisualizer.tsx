import { Star, StarHalf } from "lucide-react"

export default function RatingVisualizer({
  rating,
  text = true,
}: {
  rating: number
  text?: boolean
}) {
  return (
    <div className="flex">
      <div className="text-contrast  py-2.5 px-1 rounded-md flex flex-col justify-center items-center">
        <span className="text-lg uppercase font-semibold leading-4">
          {rating.toFixed(1)}
        </span>
        {text && <span className="text-[8px] uppercase">rating</span>}
      </div>
      <div className=" flex h-fit my-auto py-1.5 pr-0.5 rounded-r-md">
        {Array.from({ length: 5 }, (_, idx) => (
          <div key={idx} className="relative flex justify-center items-center">
            {rating >= idx + 1 ? (
              <Star
                size={20}
                className="absolute z-10"
                fill="#fcba03"
                strokeWidth={0}
              />
            ) : (
              rating >= idx + 0.5 && (
                <StarHalf
                  size={20}
                  className="absolute z-10"
                  fill="#fcba03"
                  strokeWidth={0}
                />
              )
            )}
            <Star
              size={20}
              className="relative z-0"
              fill="#dbdbdb"
              strokeWidth={0}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
