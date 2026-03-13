import { Star } from "lucide-react"

const Rating = ({ value = 0, count = 0 }) => {

  if (!count) return null

  return (
    <div className="rating">

      {[1,2,3,4,5].map((star) => (
        <Star
          key={star}
          size={14}
          className={`star ${value >= star ? "filled" : ""}`}
        />
      ))}

      <span className="review-count">
        ({count})
      </span>

    </div>
  )
}

export default Rating